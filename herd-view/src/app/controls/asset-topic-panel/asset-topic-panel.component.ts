import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { Asset } from '../../bin/model/asset';
import { Topic } from '../../bin/model/topic';
import { AssetService } from '../../services/asset.service'
import { TopicService } from '../../services/topic.service'

@Component({
  selector: 'app-asset-topic-panel',
  templateUrl: './asset-topic-panel.component.html',
  styleUrls: ['./asset-topic-panel.component.css']
})
export class AssetTopicPanelComponent implements OnInit {
    private asset: Asset;
    public available: Topic[];
    public attached: Topic[];
  
    constructor(
      private route: ActivatedRoute,
      private assetService: AssetService,
      private topicService: TopicService,
    ) { }

    ngOnInit() {
      this.getData();
    }

    getData() {
      let assetId: number = +this.route.snapshot.paramMap.get('id');

      this.assetService.getAsset(assetId)
        .subscribe(res => {
          this.asset = res;
          this.getAttachedTopics();
        });
    }

    getAttachedTopics() {
      this.assetService.getTopics(this.asset.id)
        .subscribe(res => {
          this.attached = res;
          this.getAllTopics();
        });
    }
  
    getAllTopics() {
      this.topicService.getTopics()
        .subscribe(res => {
          this.available = res.filter(e => e.name.substr(0, e.name.indexOf('_')) === this.asset.type.name).filter(e => !(this.attached.find(f => f.id == e.id)));
        });
    }

    attachTopic(topic: Topic) {
      this.assetService.addTopicToAsset(this.asset.id, topic.id).subscribe();
        //.subscribe(_ => console.log('attached topic ' + topic.id));
    }

    detachTopic(topic: Topic) {
      this.assetService.removeTopicFromAsset(this.asset.id, topic.id).subscribe();
        //.subscribe(_ => console.log('detached topic ' + topic.id));
    }

    drop(event: CdkDragDrop<Topic[]>) {
      if (event.previousContainer === event.container)
      {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      }
      else
      {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

        if (event.previousContainer['id'].toLowerCase() == 'available')
        {
          this.attachTopic(event.container.data[event.currentIndex]);
        }
        else
        {
          this.detachTopic(event.container.data[event.currentIndex]);
        }
      }
    }
  
    /** Predicate function that only allows items to be dropped into a list. */
    attachablePredicate() {
      return true;
    }
  
    /** Predicate function that doesn't allow items to be dropped into a list. */
    detachablePredicate() {
      return true;
    }
  }
  
