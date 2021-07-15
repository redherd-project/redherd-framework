import { AfterViewInit, Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Process } from '../../bin/model/process';
import { ProcessService } from '../../services/process.service';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-asset-process-panel',
  templateUrl: './asset-process-panel.component.html',
  styleUrls: ['./asset-process-panel.component.css']
})
export class AssetProcessPanelComponent implements AfterViewInit, OnInit {
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

  constructor(
    private route: ActivatedRoute,
    private assetService: AssetService,
    private processService: ProcessService) {}

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
    let id : number = +this.route.snapshot.paramMap.get('id');

    this.assetService.getProcesses(id)
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

  public refresh(): void {
    this.getData();
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
