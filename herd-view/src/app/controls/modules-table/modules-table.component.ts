import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DisplayedComponent, DisplayMode } from '../../bin/gui/display';
import { Module } from '../../bin/model/module';
import { ModuleService } from '../../services/module.service';

@Component({
  selector: 'app-modules-table',
  templateUrl: './modules-table.component.html',
  styleUrls: ['./modules-table.component.css']
})
export class ModulesTableComponent extends DisplayedComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Module>;
  dataSource: MatTableDataSource<Module>;
  dataReady: boolean = false;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { name: 'name', showOnMobile: true },
    { name: 'title', showOnMobile: false },
    { name: 'description', showOnMobile: false },
    { name: 'binary', showOnMobile: true },
    { name: 'author', showOnMobile: false },
    { name: 'topic', showOnMobile: false },
    { name: 'version', showOnMobile: false }
  ];

  constructor(private moduleService: ModuleService) {
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
    this.moduleService.getModules()
      .subscribe(modules => {
        this.dataSource.data = modules;
        this.dataReady = true;
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
