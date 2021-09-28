import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RedHerdApi } from './base/redherd-api';
import { RedHerdEntity, RedHerdRootEndpoint } from '../bin/model/base/redherd-common';
import { Module, ModuleInstance } from '../bin/model/module';
import { NotificationsService } from 'angular2-notifications';
import { JSendResponse, JSendResponseInspector, JSendNotifiable } from '../bin/model/jsend';

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

  /** POST: run module on multiple assets
    * In this case the object parameter must contain the following elements:
    * {
    *     mode: ("CONFIGURE" || "EXECUTE"),  <-- the module execution mode
    *     params: {},                        <-- the parameters required for the module execution
    *     assets: number[]                   <-- the array of asset IDs where the selected module will be launched
    * }
    */
  public runModule(moduleName: string, object: any): Observable<ModuleInstance[]> {
    const url = !this.context.Token.isEmpty() ? `${this.context.Url}/${moduleName}/run?t=${this.context.Token.value}` : `${this.context.Url}/${moduleName}/run`;
    const options = this.context.HttpOptions;

    return this.http.post<JSendResponse>(url, object, options)
      .pipe(
        map(res => {
          let deliverable: ModuleInstance[] = [];
          let inspected = JSendResponseInspector.inspect<JSendResponse[]>(res, this.notifier, RedHerdEntity.instances);
          if (!inspected.data) {
            inspected.notify();
          }
          else {
            let pushCandidate: JSendNotifiable<ModuleInstance>;
            for (let instance of inspected.data) {
              pushCandidate = JSendResponseInspector.inspect<ModuleInstance>(instance, this.notifier, RedHerdEntity.instance);
              if (pushCandidate.data) {
                deliverable.push(pushCandidate.data);
              }
              else {
                deliverable.push(null);
              }
            }
          }
          return deliverable;
        }),            
        catchError(err => { return throwError(err); })
      );
  }
}
