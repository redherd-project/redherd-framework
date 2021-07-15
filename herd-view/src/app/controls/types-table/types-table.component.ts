import { AfterViewInit, Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Type } from '../../bin/model/type';
import { TypeService } from '../../services/type.service';

@Component({
  selector: 'app-types-table',
  templateUrl: './types-table.component.html',
  styleUrls: ['./types-table.component.css']
})
export class TypesTableComponent implements AfterViewInit, OnInit {
  private currentDisplay: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Type>;
  dataSource: MatTableDataSource<Type>;
  dataReady: boolean = false;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    { name: 'name', showOnMobile: true },
    { name: 'description', showOnMobile: false },
    { name: 'details', showOnMobile: true }
  ];

  constructor(private typeService: TypeService) {}

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
    this.typeService.getTypes()
      .subscribe(types => {
        this.dataSource.data = types;
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

  public addType(): void {}

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
