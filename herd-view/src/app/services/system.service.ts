import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { RedHerdApi } from './base/redherd-api';
import { RedHerdEntity, RedHerdRootEndpoint } from '../bin/model/base/redherd-common';
import { System } from '../bin/model/system';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class SystemService extends RedHerdApi {

  constructor(
    protected http: HttpClient,
    protected notifier: NotificationsService
  ) {
    super(RedHerdRootEndpoint.system, http, notifier);
  }

  /** GET: retrieve system context from server */
  public getSystem(): Observable<System> {
    //return this.get(RedHerdEntity.system, '').pipe(shareReplay<System>());
    return this.get(RedHerdEntity.system, '');
  }
}
