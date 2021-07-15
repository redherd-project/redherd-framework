import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Topic } from '../../bin/model/topic';
import { TopicService } from '../../services/topic.service';

@Component({
  selector: 'app-topic-panel',
  templateUrl: './topic-panel.component.html',
  styleUrls: ['./topic-panel.component.css']
})
export class TopicPanelComponent implements OnInit {
  topic: Topic;

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    let id : number = +this.route.snapshot.paramMap.get('id');

    this.topicService.getTopic(id)
      .subscribe(topic => this.topic = topic);
  }

  save(): void {
    this.topicService.updateTopic(this.topic)
      .subscribe(() => this.back());
  }

  back(): void {
    this.location.back();
  }
}
