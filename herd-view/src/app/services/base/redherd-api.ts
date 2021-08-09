import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RedHerdWebContext } from './redherd-web';
import { RedHerdObject, RedHerdEntity, RedHerdRootEndpoint } from '../../bin/model/base/redherd-common';
import { JwtToken } from '../../bin/model/token';
import { JSendResponse, JSendResponseInspector } from '../../bin/model/jsend';
import { Config } from '../../config';
import { NotificationsService } from 'angular2-notifications';


export class RedHerdApiContext extends RedHerdWebContext {
  private url: string;
  
  constructor(endpoint: RedHerdRootEndpoint) {
    super();
    this.url = `${Config.api_url}/${endpoint}`;
  }

  public get Url(): string {
    return this.url;
  }
}

export abstract class RedHerdApi {
  protected context: RedHerdApiContext;

  constructor(
    endpoint: RedHerdRootEndpoint,
    protected http: HttpClient,
    protected notifier: NotificationsService
  ) {
    this.context = new RedHerdApiContext(endpoint);
  }

  public get Token(): JwtToken {
    return this.context.Token;
  }

  /** GET: retrieve objects from server */
  protected getAll<T>(entity: RedHerdEntity): Observable<T[]> {
    //const url = `${this.context.Url}`;
    const url = !this.context.Token.isEmpty() ? `${this.context.Url}?t=${this.context.Token.value}` : `${this.context.Url}`;
    const options = this.context.HttpOptions;

    return this.http.get<JSendResponse>(url, options)
      .pipe(
        map(res => { 
          let inspected = JSendResponseInspector.inspect<T[]>(res, this.notifier, entity);
          if (!inspected.data) {
            inspected.notify();
          }
          return inspected.data;   
        }),
        catchError(err => { return throwError(err); })
      );
  }

  /** GET: retrieve object by id */
  protected get<T>(entity: RedHerdEntity, param: number | string): Observable<T> {
    //const url = `${this.context.Url}/${param}`;
    const url = !this.context.Token.isEmpty() ? `${this.context.Url}/${param}?t=${this.context.Token.value}` : `${this.context.Url}/${param}`;
    const options = this.context.HttpOptions;

    return this.http.get<JSendResponse>(url, options)
      .pipe(
        map(res => { 
          let inspected = JSendResponseInspector.inspect<T>(res, this.notifier, entity);
          if (!inspected.data) {
            inspected.notify();
          }
          return inspected.data;   
        }),
        catchError(err => { return throwError(err); })
      );
  }

  /** POST: add new object to server */
  protected add(object: RedHerdObject): Observable<boolean> {
    //const url = `${this.context.Url}`;
    const url = !this.context.Token.isEmpty() ? `${this.context.Url}?t=${this.context.Token.value}` : `${this.context.Url}`;
    const options = this.context.HttpOptions;

    return this.http.post<JSendResponse>(url, object, options)
      .pipe(
        map(res => { 
          let inspected = JSendResponseInspector.inspect<boolean>(res, this.notifier);
          if (!inspected.data) {
            inspected.notify();
          }
          return inspected.data;  
        }),
        catchError(err => { return throwError(err); })
      );
  }

  /** DELETE: delete an object from server */
  protected delete(id: number): Observable<boolean> {
    //const url = `${this.context.Url}/${id}`;
    const url = !this.context.Token.isEmpty() ? `${this.context.Url}/${id}?t=${this.context.Token.value}` : `${this.context.Url}/${id}`;
    const options = this.context.HttpOptions;

    return this.http.delete<JSendResponse>(url, options)
      .pipe(
        map(res => { 
          let inspected = JSendResponseInspector.inspect<boolean>(res, this.notifier);
          if (!inspected.data) {
            inspected.notify();
          }
          return inspected.data;
        }),
        catchError(err => { return throwError(err); })
      );
  }

  /** PUT: update an object on server */
  protected update(object: RedHerdObject): Observable<boolean> {
    //const url = `${this.context.Url}/${object.id}`;
    const url = !this.context.Token.isEmpty() ? `${this.context.Url}/${object.id}?t=${this.context.Token.value}` : `${this.context.Url}/${object.id}`;
    const options = this.context.HttpOptions;

    return this.http.put<JSendResponse>(url, object, options)
    .pipe(
      map(res => { 
        let inspected = JSendResponseInspector.inspect<boolean>(res, this.notifier);
        if (!inspected.data) {
          inspected.notify();
        }
        return inspected.data;
      }),      catchError(err => { return throwError(err); })
    );
  }
}