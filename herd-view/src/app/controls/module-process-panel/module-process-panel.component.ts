import { AfterViewInit, Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { interval } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AdaptiveComponent, DisplayMode } from '../../bin/gui/display';
import { Process } from '../../bin/model/process';
import { ProcessService } from '../../services/process.service';
import { Config } from 'src/app/config';

@Component({
  selector: 'app-module-process-panel',
  templateUrl: './module-process-panel.component.html',
  styleUrls: ['./module-process-panel.component.css']
})
export class ModuleProcessPanelComponent extends AdaptiveComponent implements AfterViewInit, OnInit {
  private processes: Process[];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Process>;
  dataSource: MatTableDataSource<Process>;
  dataReady: boolean = false;

  @Input() moduleName: string;
  @Output() resumeProcessRequested = new EventEmitter<any>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { name: 'id', showOnMobile: true },
    { name: 'module', showOnMobile: true },
    { name: 'session', showOnMobile: false },
    { name: 'resume', showOnMobile: true },
    { name: 'remove', showOnMobile: true }
  ];

  constructor(private processService: ProcessService) {
    super();
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    
    this.getData();

    interval(Config.assets_refresh_interval).subscribe(_ => {
      this.getData();
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  private getData(): void {
    this.processService.getProcesses()
      .subscribe(processes => {
        this.processes = processes.filter(p => p.module === this.moduleName);
        this.dataSource.data = this.processes;
        this.dataReady = true; 
      });
  }
 
  public refresh(): void {
    this.getData();
  }

  public resume(id: number): void {
    let process: Process = this.processes.find(e => e.id == id);

    if (process) {
      this.resumeProcessRequested.emit({ assetId: process.id_asset, session: process.session, module: process.module });
    }
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
