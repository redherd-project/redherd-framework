import { AfterViewInit, Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AdaptiveComponent, DisplayMode } from '../../bin/gui/display';
import { Config } from 'src/app/config';
import { Module } from '../../bin/model/module';
import { ModuleService } from '../../services/module.service';

@Component({
  selector: 'app-modules-table',
  templateUrl: './modules-table.component.html',
  styleUrls: ['./modules-table.component.css']
})
export class ModulesTableComponent extends AdaptiveComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Module>;
  dataSource: MatTableDataSource<Module>;
  dataReady: boolean = false;
  serverUrl: string;
  imgPlaceholder: string;

  @Output() openModuleTab = new EventEmitter();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { name: 'icon', showOnMobile: false },
    { name: 'topic', showOnMobile: false },
    { name: 'title', showOnMobile: true },
    { name: 'description', showOnMobile: false },
    { name: 'details', showOnMobile: true }
  ];

  constructor(private moduleService: ModuleService) {
    super();

    this.serverUrl = Config.api_server_proto + '://' + Config.api_server_address + ':' + Config.api_server_port;
    this.imgPlaceholder = Config.asset_image_placeholder;
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
    this.moduleService.getModules()
      .subscribe(modules => {
        this.dataSource.data = modules.filter(m => m.tags.includes('automatic'));
        this.dataReady = true;
      });
  }

  public openModuleDetails(name: string, title: string): void {
    this.openModuleTab.emit({ name: name, title: title });
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
