import { AfterViewInit, Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AdaptiveComponent, DisplayMode } from '../../bin/gui/display';
import { ModuleVerb } from '../../bin/model/module';
import { Topic } from '../../bin/model/topic';
import { AssetService } from '../../services/asset.service'
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SocketioService } from '../../services/socket-io.service';
import { Lv2Message } from '../../bin/proto/lv2-message';

@Component({
  selector: 'app-module-asset-panel',
  templateUrl: './module-asset-panel.component.html',
  styleUrls: ['./module-asset-panel.component.css']
})
export class ModuleAssetPanelComponent extends AdaptiveComponent implements AfterViewInit, OnInit {
  private attachableAssets: any[] = [];
  private attachedAssetIds: number[] = [];

  private messages$: Observable<Lv2Message>;
  assetsStatus = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Topic>;
  dataSource: MatTableDataSource<Topic>;

  selectedAll: boolean = false;
  dataReady: boolean = false;

  @Input() moduleName: string;
  @Input() assetResponses: any[];

  @Output() moduleActivationRequested = new EventEmitter<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { name: 'attached', showOnMobile: true },
    { name: 'name', showOnMobile: true },
    { name: 'ip', showOnMobile: false },
    { name: 'user', showOnMobile: false },
    { name: 'status', showOnMobile: true },
    { name: 'launched', showOnMobile: true },
    { name: 'description', showOnMobile: false },
  ];

  constructor(private assetService: AssetService, private socketioService: SocketioService) {
    super();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.getData();

    this.messages$ = this.socketioService.getMessages().pipe(shareReplay(1));
    this.getStatus();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnChanges(changes) {
    this.attachableAssets.forEach(asset => {
      if (!(asset.id in this.assetResponses)) {
        asset.launched = false;
      } else {
        asset.launched = (this.assetResponses[asset.id] != null) && (this.assetsStatus[asset.id].status == 'online');
      }
    });
  }

  private getData(): void {
    this.assetService.getAssets()
      .subscribe(assets => {
        this.selectedAll = false;

        let displayableAssets = assets.filter(e => !!e.joined === true && e.type.name === this.moduleName.split('_')[0]);

        this.attachableAssets = [];
        displayableAssets.forEach(asset => {
          this.attachableAssets.push({ id: asset.id, name: asset.name, ip: asset.ip, user: asset.user, description: asset.description, attached: false, launched: false });
        });

        this.dataSource.data = this.attachableAssets;
        this.dataReady = true;
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

  public selectAll(event: MatCheckboxChange): void {
    if (event.checked) {
      this.attachableAssets.forEach(asset => asset['attached'] = true);
    } else {
      this.attachableAssets.forEach(asset => asset['attached'] = false);
    }
    this.selectedAll = event.checked;
  }

  public refresh(): void {
    this.getData();
  }

  public execute(): void {
    this.getAttachedAssetIds();
    this.moduleActivationRequested.emit({ mode: ModuleVerb.execute, assets: this.attachedAssetIds });
  }

  public configure(): void {
    this.getAttachedAssetIds();
    this.moduleActivationRequested.emit({ mode: ModuleVerb.configure, assets: this.attachedAssetIds });
  }

  public getAttachedAssetIds(): void {
    this.attachedAssetIds = [];
    this.attachableAssets.forEach(asset => {
      if (asset.attached) {
        this.attachedAssetIds.push(asset.id);
      }
    });
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