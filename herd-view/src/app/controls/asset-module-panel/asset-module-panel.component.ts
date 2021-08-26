import { AfterViewInit, Component, OnInit, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DisplayedComponent, DisplayMode } from '../../bin/gui/display';
import { Module } from '../../bin/model/module';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-asset-module-panel',
  templateUrl: './asset-module-panel.component.html',
  styleUrls: ['./asset-module-panel.component.css']
})
export class AssetModulePanelComponent extends DisplayedComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Module>;
  dataSource: MatTableDataSource<Module>;
  dataReady: boolean = false;

  @Input() assetId: number;
  @Output() moduleViewEnabled = new EventEmitter<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { name: 'topic', showOnMobile: false },
    { name: 'name', showOnMobile: true },
    { name: 'title', showOnMobile: false },
    { name: 'description', showOnMobile: false },
    { name: 'binary', showOnMobile: false },
    { name: 'execute', showOnMobile: true }
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
    this.assetService.getModules(+this.assetId)
      .subscribe(modules => {
        this.dataSource.data = modules;
        this.dataReady = true;
      });
  }

  public viewModule(moduleName): void {
    this.moduleViewEnabled.emit({ assetId: +this.assetId, module: moduleName });
  }

  public refresh(): void {
    this.getData();
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
