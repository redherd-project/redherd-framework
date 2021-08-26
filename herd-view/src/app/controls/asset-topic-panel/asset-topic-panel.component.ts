import { AfterViewInit, Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DisplayedComponent, DisplayMode } from '../../bin/gui/display';
import { Asset } from '../../bin/model/asset';
import { Topic } from '../../bin/model/topic';
import { AssetService } from '../../services/asset.service'
import { TopicService } from '../../services/topic.service'
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-asset-topic-panel',
  templateUrl: './asset-topic-panel.component.html',
  styleUrls: ['./asset-topic-panel.component.css']
})
export class AssetTopicPanelComponent extends DisplayedComponent implements AfterViewInit, OnInit {
    private asset: Asset;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatTable) table: MatTable<Topic>;
    dataSource: MatTableDataSource<Topic>;
    dataReady: boolean = false;

    @Input() assetId: number;

    /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
    displayedColumns = [
      { name: 'attached', showOnMobile: true },
      { name: 'name', showOnMobile: true },
      { name: 'description', showOnMobile: false }
    ];

    constructor(private assetService: AssetService, private topicService: TopicService) {
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
      this.assetService.getAsset(+this.assetId)
        .subscribe(asset => {
          this.asset = asset;
          this.getTopics();
        });
    }

    private getTopics(): void {
      let available: Topic[];
      let attached: Topic[];

      this.assetService.getTopics(+this.assetId)
        .subscribe(topics => {
          attached = topics;

          this.topicService.getTopics()
          .subscribe(topics => {
            let displayable: any[] = [];
  
            available = topics
                          .filter(e => e.name.substr(0, e.name.indexOf('_')) === this.asset.type.name)
                          .filter(e => !(attached.find(f => f.id == e.id)));

            attached.forEach(topic => {
              displayable.push({ id: topic.id, name: topic.name, description: topic.description, attached: true });
            });

            available.forEach(topic => {
              displayable.push({ id: topic.id, name: topic.name, description: topic.description, attached: false });
            });

            this.dataSource.data = displayable;
            this.dataReady = true;
          });

        });
    }
  
    private attachTopic(topic: Topic): void {
      this.assetService.addTopicToAsset(+this.assetId, topic.id).subscribe();
    }

    private detachTopic(topic: Topic): void {
      this.assetService.removeTopicFromAsset(+this.assetId, topic.id).subscribe();
    }

    public update(event: MatCheckboxChange, selectedTopic: any): void {
      let topic: Topic = { id: selectedTopic.id, name: selectedTopic.name, description:selectedTopic.description }

      if (event.checked) {
        this.attachTopic(topic);
      }
      else {
        this.detachTopic(topic);
      }
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