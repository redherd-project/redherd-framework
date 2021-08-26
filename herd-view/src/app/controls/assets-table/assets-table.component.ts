import { AfterViewInit, Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DisplayedComponent, DisplayMode } from '../../bin/gui/display';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Config } from 'src/app/config';
import { Asset } from '../../bin/model/asset';
import { AssetService } from '../../services/asset.service';
import { SocketioService } from '../../services/socket-io.service';
import { Lv2Message } from '../../bin/proto/lv2-message';

@Component({
  selector: 'app-assets-table',
  templateUrl: './assets-table.component.html',
  styleUrls: ['./assets-table.component.css']
})
export class AssetsTableComponent extends DisplayedComponent implements AfterViewInit, OnInit {
  private messages$: Observable<Lv2Message>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Asset>;
  dataSource: MatTableDataSource<Asset>;
  assetsStatus;
  dataReady: boolean;
  serverUrl: string;
  imgPlaceholder: string;

  @Output() openAssetTab = new EventEmitter();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { name: 'icon', showOnMobile: false },
    { name: 'name', showOnMobile: true },
    { name: 'ip', showOnMobile: false },
    { name: 'status', showOnMobile: true },
    { name: 'user', showOnMobile: false },
    { name: 'description', showOnMobile: false },
    { name: 'details', showOnMobile: true }
  ];

  constructor(private assetService: AssetService, private socketioService: SocketioService, private dbService: NgxIndexedDBService) {
    super();

    this.assetsStatus = {};
    this.dataReady = false;
    this.serverUrl = Config.api_server_proto + '://' + Config.api_server_address + ':' + Config.api_server_port;
    this.imgPlaceholder = Config.asset_image_placeholder;
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    
    this.retrieveAssetsFromDatabase();

    interval(Config.assets_refresh_interval).subscribe(_ => {
      this.storeAssetsIntoDatabase();
    });

    this.messages$ = this.socketioService.getMessages().pipe(shareReplay(1));
    this.getStatus();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  private getData(): void {
    this.assetService.getAssets()
      .subscribe(assets => {
        // Show only joined assets
        this.dataSource.data = assets.filter(e => !!e.joined === true);
      });
  }

  private getStatus(): void {
    this.messages$
      .subscribe((message: Lv2Message) => {
        let messageSrc : number = 0;
        let messageType : string = '';
        let status : string = '';
        let icon : string = '';

        if (message.dst == 'keep_alive')
        {
            messageSrc = +message.src;
            messageType = message.payload.type.toLowerCase();

            status = messageType == 'stdout' ? 'online' : 'offline';
            icon = status == 'online' ? 'link' : 'link_off';

            this.assetsStatus[messageSrc] = { status: status, icon: icon };
        }
      }); 
  }

  private retrieveAssetsFromDatabase(): void {
    this.getData();

    // Retrieve assets data from database
    this.dbService.getAll(Config.assets_data_store)
      .then(
        dbData => {
          this.dataSource.data = dbData as Asset[];
        },
        err => { console.log(err); }
      );

    // Retreive assets status from database
    this.dbService.getAll(Config.assets_status_store)
      .then(
        dbData => {
          for (let status of dbData) 
          {
            this.assetsStatus[status['id']] = {status: status['status'], 'icon': status['icon']};
          }
        },
        err => { console.log(err); }
      );
    this.dataReady = true;
  }

  private storeAssetsIntoDatabase(): void {
    this.getData();

    // Store last asset data into database
    this.dbService.clear(Config.assets_data_store);
    for (let asset of this.dataSource.data)
    {
      this.dbService.update(Config.assets_data_store, asset)
        .then(
          () => {},
          err => { console.log(err); }
        );
    }

    // Store last asset status into database
    for (let key in this.assetsStatus)
    {
      if (this.dataSource.data.filter(function(asset){ return asset.id === +key }).length > 0)
      {
        this.dbService.update(Config.assets_status_store, { id: key, status: this.assetsStatus[key]['status'], icon: this.assetsStatus[key]['icon'] })
          .then(
            () => {},
            err => { console.log(err); }
          );
      }
      else
      {
        this.dbService.delete(Config.assets_status_store, +key);
        delete this.assetsStatus[+key];
      }
    }
  }

  public openAssetDetails(index: number, name: string): void {
    this.openAssetTab.emit({ id: index, name: name });
  }

  public getDisplayedColumns(): string[] {
    return this.displayedColumns
                  .filter(cd => (this.displayMode !== DisplayMode.mobile) || cd.showOnMobile)
                  .map(cd => cd.name);
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
