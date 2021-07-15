import { AfterViewInit, Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Process } from '../../bin/model/process';
import { ProcessService } from '../../services/process.service';

@Component({
  selector: 'app-processes-table',
  templateUrl: './processes-table.component.html',
  styleUrls: ['./processes-table.component.css']
})
export class ProcessesTableComponent implements AfterViewInit, OnInit {
  private currentDisplay: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Process>;
  dataSource: MatTableDataSource<Process>;
  dataReady: boolean = false;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { name: 'module', showOnMobile: true },
    { name: 'session', showOnMobile: false },
    { name: 'assetId', showOnMobile: false },
    { name: 'remove', showOnMobile: true }
  ];

  constructor(private processService: ProcessService) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.getDisplayMode();
    this.getData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  @HostListener('window:resize', ['$event'])
  onResize(_) {
    this.getDisplayMode();
  }

  private getData(): void {
    this.processService.getProcesses()
      .subscribe(processes => {
        this.dataSource.data = processes;
        this.dataReady = true; 
      });
  }
  
  private getDisplayMode(): void {
    this.currentDisplay = window.innerWidth >= 768 ? 'desktop' : 'mobile';
  }

  public getDisplayedColumns(): string[] {
    const isMobile = this.currentDisplay === 'mobile';

    const columns = this.displayedColumns
    .filter(cd => !isMobile || cd.showOnMobile)
    .map(cd => cd.name);

    return columns;
  }

  public remove(id: number): void {
    this.processService.deleteProcess(id)
      .subscribe(_ => this.getData());
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
