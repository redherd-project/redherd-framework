import { AfterViewInit, Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DisplayedComponent, DisplayMode } from '../../bin/gui/display';
import { Asset } from '../../bin/model/asset';
import { ModuleVerb } from '../../bin/model/module';
import { Topic } from '../../bin/model/topic';
import { AssetService } from '../../services/asset.service'
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-module-asset-panel',
  templateUrl: './module-asset-panel.component.html',
  styleUrls: ['./module-asset-panel.component.css']
})
export class ModuleAssetPanelComponent extends DisplayedComponent implements AfterViewInit, OnInit {
  private attachableAssets: any[] = [];
  private attachedAssetIds: number[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Topic>;
  dataSource: MatTableDataSource<Topic>;
  dataReady: boolean = false;

  @Input() moduleName: string;
  
  @Output() moduleActivationRequested = new EventEmitter<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { name: 'attached', showOnMobile: true },
    { name: 'id', showOnMobile: true },
    { name: 'name', showOnMobile: true },
    { name: 'ip', showOnMobile: false },
    { name: 'user', showOnMobile: false },
    { name: 'description', showOnMobile: false },
  ];

  constructor(private assetService: AssetService) {
    super();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.getData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  private getData(): void {
    this.assetService.getAssets()
      .subscribe(assets => {
        let displayableAssets = assets.filter(e => !!e.joined === true && e.type.name === this.moduleName.split('_')[0]);

        this.attachableAssets = [];
        displayableAssets.forEach(asset => {
          this.attachableAssets.push({ id: asset.id, name: asset.name, ip: asset.ip, user: asset.user, description: asset.description, attached: false });
        });

        this.dataSource.data = this.attachableAssets;
        this.dataReady = true;
      });
  }

  public selectAll(event: MatCheckboxChange): void {
    if (event.checked) {
      this.attachableAssets.forEach(asset => asset['attached'] = true);
    }
    else {
      this.attachableAssets.forEach(asset => asset['attached'] = false);
    }
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
    this.attachableAssets.forEach(asset => this.attachedAssetIds.push(asset.id));
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