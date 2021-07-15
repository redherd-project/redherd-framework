import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RedHerdApi } from './base/redherd-api';
import { RedHerdEntity, RedHerdRootEndpoint } from '../bin/model/base/redherd-common';
import { Topic } from '../bin/model/topic';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class TopicService extends RedHerdApi {
  
  constructor(
    protected http: HttpClient,
    protected notifier: NotificationsService
  ) {
    super(RedHerdRootEndpoint.topics, http, notifier);
  }

  /** GET: retrieve processes from server */
  public getTopics(): Observable<Topic[]> {
    return this.getAll(RedHerdEntity.topics);
  }

  /** GET: retrieve topic by id */
  public getTopic(id: number): Observable<Topic> {
    return this.get(RedHerdEntity.topic, id);
  }

  /** POST: add new topic to server */
  public addTopic(topic: Topic): Observable<boolean> {
    // Preliminary data normalization
    // NOTE: the id property must be omitted in the add function
    topic.id = null;

    return this.add(topic);
  }

  /** DELETE: delete topic from server */
  public deleteTopic(topic: Topic | number): Observable<boolean> {
    // Preliminary data normalization
    // NOTE: the base class needs a numeric parameter
    const id = typeof topic === 'number' ? topic : topic.id;

    return this.delete(id);
  }

  /** PUT: update topic on server */
  public updateTopic(topic: Topic): Observable<boolean> {
    return this.update(topic);
  }
}
