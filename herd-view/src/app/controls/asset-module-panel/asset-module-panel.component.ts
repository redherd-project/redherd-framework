import { AfterViewInit, Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Module } from '../../bin/model/module';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-asset-module-panel',
  templateUrl: './asset-module-panel.component.html',
  styleUrls: ['./asset-module-panel.component.css']
})
export class AssetModulePanelComponent implements AfterViewInit, OnInit {
  private currentDisplay: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Module>;
  dataSource: MatTableDataSource<Module>;
  dataReady: boolean = false;
  assetId: number;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { name: 'name', showOnMobile: true },
    { name: 'title', showOnMobile: false },
    { name: 'description', showOnMobile: false },
    { name: 'binary', showOnMobile: false },
    { name: 'author', showOnMobile: false },
    { name: 'topic', showOnMobile: false },
    { name: 'version', showOnMobile: false },
    { name: 'execute', showOnMobile: true }
  ];

  constructor(
    private route: ActivatedRoute,
    private assetService: AssetService) {
      this.assetId = +this.route.snapshot.paramMap.get('id');
    }

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
    this.assetService.getModules(this.assetId)
      .subscribe(modules => {
        this.dataSource.data = modules;
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

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
