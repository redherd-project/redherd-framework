import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RedHerdApi } from './base/redherd-api';
import { RedHerdEntity, RedHerdRootEndpoint } from '../bin/model/base/redherd-common';
import { Module } from '../bin/model/module';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class ModuleService extends RedHerdApi {
  
  constructor(
    protected http: HttpClient,
    protected notifier: NotificationsService
  ) {
    super(RedHerdRootEndpoint.modules, http, notifier);
  }

  /** GET: retrieve modules from server */
  public getModules(): Observable<Module[]> {
    return this.getAll(RedHerdEntity.modules);
  }

  /** GET: retrieve module by id */
  public getModule(name: string): Observable<Module> {
    return this.get(RedHerdEntity.module, name);
  }
}
