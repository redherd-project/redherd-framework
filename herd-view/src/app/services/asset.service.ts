import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RedHerdApi } from './base/redherd-api';
import { RedHerdEntity, RedHerdRootEndpoint } from '../bin/model/base/redherd-common';
import { Asset } from '../bin/model/asset';
import { Topic } from '../bin/model/topic';
import { Module, ModuleInstance } from '../bin/model/module';
import { Process } from '../bin/model/process';
import { JSendResponse, JSendResponseInspector } from '../bin/model/jsend';
import { NotificationsService } from 'angular2-notifications';


@Injectable({
  providedIn: 'root'
})
export class AssetService extends RedHerdApi {

  constructor(
    protected http: HttpClient,
    protected notifier: NotificationsService
  ) {
    super(RedHerdRootEndpoint.assets, http, notifier);
  }

  /** GET: retrieve assets from server */
  public getAssets(): Observable<Asset[]> {
    return this.getAll(RedHerdEntity.assets);
  }

  /** GET: retrieve asset by id */
  public getAsset(id: number): Observable<Asset> {
    return this.get(RedHerdEntity.asset, id);
  }

  /** POST: add new asset to server */
  public addAsset(asset: Asset): Observable<Boolean> {
    // Preliminary data normalization
    // NOTE: the id property must be omitted in the add function
    asset.id = null;

    return this.add(asset);
  }

  /** DELETE: delete an asset from server */
  public deleteAsset(asset: Asset | number): Observable<Boolean> {
    // Preliminary data normalization
    // NOTE: the base class needs a numeric parameter
    const id = typeof asset === 'number' ? asset : asset.id;

    return this.delete(id);
  }

  /** PUT: update an asset on server */
  public updateAsset(asset: Asset): Observable<boolean> {

    // Preliminary asset object normalization
    
    let data = {
      id: asset.id,
      description: asset.description
    };

    return this.update(data);
  }

  /** GET: retrieve asset topics from server */
  public getTopics(id: number): Observable<Topic[]> {
    //const url = `${this.context.Url}/${id}/${RedHerdRootEndpoint.topics}`;
    const url = !this.context.Token.isEmpty() ? `${this.context.Url}/${id}/${RedHerdRootEndpoint.topics}?t=${this.context.Token.value}` : `${this.context.Url}/${id}/${RedHerdRootEndpoint.topics}`;
    const options = this.context.HttpOptions;

    return this.http.get<JSendResponse>(url, options)
      .pipe(
        map(res => { 
          let inspected = JSendResponseInspector.inspect<Topic[]>(res, this.notifier, RedHerdEntity.topics);
          if (!inspected.data) {
            inspected.notify();
          }
          return inspected.data;
        }),
        catchError(err => { return throwError(err); })
      );
  }

  /** GET: retrieve asset modules from server */
  public getModules(id: number): Observable<Module[]> {
    //const url = `${this.context.Url}/${id}/${RedHerdRootEndpoint.modules}`;
    const url = !this.context.Token.isEmpty() ? `${this.context.Url}/${id}/${RedHerdRootEndpoint.modules}?t=${this.context.Token.value}` : `${this.context.Url}/${id}/${RedHerdRootEndpoint.modules}`;
    const options = this.context.HttpOptions;

    return this.http.get<JSendResponse>(url, options)
      .pipe(
        map(res => { 
          let inspected = JSendResponseInspector.inspect<Module[]>(res, this.notifier, RedHerdEntity.modules);
          if (!inspected.data) {
            inspected.notify();
          }
          return inspected.data;
        }),        
        catchError(err => { return throwError(err); })
      );
  }

  /** GET: retrieve asset processes from server */
  public getProcesses(id: number): Observable<Process[]> {
    //const url = `${this.context.Url}/${id}/${RedHerdRootEndpoint.processes}`;
    const url = !this.context.Token.isEmpty() ? `${this.context.Url}/${id}/${RedHerdRootEndpoint.processes}?t=${this.context.Token.value}` : `${this.context.Url}/${id}/${RedHerdRootEndpoint.processes}`;
    const options = this.context.HttpOptions;

    return this.http.get<JSendResponse>(url, options)
      .pipe(
        map(res => { 
          let inspected = JSendResponseInspector.inspect<Process[]>(res, this.notifier, RedHerdEntity.processes);
          if (!inspected.data) {
            inspected.notify();
          }
          return inspected.data;
        }),        
        catchError(err => { return throwError(err); })
      );
  }

  /** POST: attach topic to asset */
  public addTopicToAsset(asset: Asset | number, topic: Topic | number): Observable<boolean> {
    const assetId = typeof asset === 'number' ? asset : asset.id;
    const topicId = typeof topic === 'number' ? topic : topic.id;
    //const url = `${this.context.Url}/${assetId}/${RedHerdRootEndpoint.topics}`;
    const url = !this.context.Token.isEmpty() ? `${this.context.Url}/${assetId}/${RedHerdRootEndpoint.topics}?t=${this.context.Token.value}` : `${this.context.Url}/${assetId}/${RedHerdRootEndpoint.topics}`;
    const options = this.context.HttpOptions;

    // Preliminary PUT data normalization
    let data = { topicId: topicId };

    return this.http.put<JSendResponse>(url, data, options)
      .pipe(
        map(res => { 
          let inspected = JSendResponseInspector.inspect<boolean>(res, this.notifier, RedHerdEntity.topics);
          if (!inspected.data) {
            inspected.notify();
          }
          return inspected.data;
        }),        
        catchError(err => { return throwError(err); })
      );
  }

  /** DELETE: remove topic form asset */
  public removeTopicFromAsset(asset: Asset | number, topic: Topic | number): Observable<boolean> {
    const assetId = typeof asset === 'number' ? asset : asset.id;
    const topicId = typeof topic === 'number' ? topic : topic.id;
    //const url = `${this.context.Url}/${assetId}/${RedHerdRootEndpoint.topics}/${topicId}`;
    const url = !this.context.Token.isEmpty() ? `${this.context.Url}/${assetId}/${RedHerdRootEndpoint.topics}/${topicId}?t=${this.context.Token.value}` : `${this.context.Url}/${assetId}/${RedHerdRootEndpoint.topics}/${topicId}`;
    const options = this.context.HttpOptions;

    return this.http.delete<JSendResponse>(url, options)
      .pipe(
        map(res => { 
          let inspected = JSendResponseInspector.inspect<boolean>(res, this.notifier, RedHerdEntity.topics);
          if (!inspected.data) {
            inspected.notify();
          }
          return inspected.data;
        }),   
        catchError(err => { return throwError(err); })
      );
  }

    /** POST: run module (execute/interact/configure) */
    public runModule(assetId: number, moduleName: string, object: any): Observable<ModuleInstance> {
      //const url = `${this.context.Url}/${assetId}/${RedHerdRootEndpoint.modules}/${moduleName}/run`;
      const url = !this.context.Token.isEmpty() ? `${this.context.Url}/${assetId}/${RedHerdRootEndpoint.modules}/${moduleName}/run?t=${this.context.Token.value}` : `${this.context.Url}/${assetId}/${RedHerdRootEndpoint.modules}/${moduleName}/run`;
      const options = this.context.HttpOptions;
  
      return this.http.post<JSendResponse>(url, object, options)
        .pipe(
          map(res => { 
            let inspected = JSendResponseInspector.inspect<ModuleInstance>(res, this.notifier, RedHerdEntity.instance);
            if (!inspected.data) {
              inspected.notify();
            }
            return inspected.data;
          }),            
          catchError(err => { return throwError(err); })
        );
    }
}
