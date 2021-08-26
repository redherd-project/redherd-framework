import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DisplayedComponent, DisplayMode } from '../../bin/gui/display';
import { Process } from '../../bin/model/process';
import { ProcessService } from '../../services/process.service';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-processes-table',
  templateUrl: './processes-table.component.html',
  styleUrls: ['./processes-table.component.css']
})
export class ProcessesTableComponent extends DisplayedComponent implements AfterViewInit, OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Process>;
  dataSource: MatTableDataSource<Process>;
  dataReady: boolean = false;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { name: 'module', showOnMobile: true },
    { name: 'session', showOnMobile: false },
    { name: 'asset', showOnMobile: false },
    { name: 'remove', showOnMobile: true }
  ];

  constructor(private processService: ProcessService, private assetService: AssetService) {
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
    this.processService.getProcesses()
      .subscribe(processes => {
        this.assetService.getAssets()
          .subscribe(assets => {
            let displayable: any[] = [];
            assets.forEach(asset => {
              processes.forEach(process => {
                if (process.id_asset == asset.id) {
                  displayable.push({ id: process.id, module: process.module, session: process.session, asset: asset.name });
                }
              });
            });
            this.dataSource.data = displayable;
            this.dataReady = true;
          });
      });
  }

  public remove(id: number): void {
    this.processService.deleteProcess(id)
      .subscribe(_ => this.getData());
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
