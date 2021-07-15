import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RedHerdApi } from './base/redherd-api';
import { RedHerdEntity, RedHerdRootEndpoint } from '../bin/model/base/redherd-common';
import { Type } from '../bin/model/type';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class TypeService extends RedHerdApi {
  
  constructor(
    protected http: HttpClient,
    protected notifier: NotificationsService
  ) {
    super(RedHerdRootEndpoint.types, http, notifier);
  }

  /** GET: retrieve types from server */
  public getTypes(): Observable<Type[]> {
    return this.getAll(RedHerdEntity.types);
  }

  /** GET: retrieve type by id */
  public getType(id: number): Observable<Type> {
    return this.get(RedHerdEntity.type, id);
  }

  /** POST: add new type to server */
  public addType(type: Type): Observable<boolean> {
    // Preliminary data normalization
    // NOTE: the id property must be omitted in the add function
    type.id = null;

    return this.add(type);
  }

  /** DELETE: delete the type from the server */
  public deleteType(type: Type | number): Observable<boolean> {
    // Preliminary data normalization
    // NOTE: the base class needs a numeric parameter
    const id = typeof type === 'number' ? type : type.id;

    return this.delete(id);
  }

  /** PUT: update the type on the server */
  public updateType(type: Type): Observable<boolean> {
    return this.update(type);
  }
}
