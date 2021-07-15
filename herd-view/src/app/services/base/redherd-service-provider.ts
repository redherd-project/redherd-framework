import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { JSendResponse, JSendResponseInspector } from '../../bin/model/jsend';
import { RedHerdApiContext } from './redherd-api';
import { RedHerdRootEndpoint, RedHerdEntity } from '../../bin/model/base/redherd-common';
import { ServiceRequest, ServiceRequestEnvelope, ServiceResponse, ServiceOperation, ServiceType } from '../../bin/model/service';
import { Asset } from '../../bin/model/asset';
import { NotificationsService } from 'angular2-notifications';

export class RedHerdServiceProvider {
  protected context: RedHerdApiContext;
  protected serviceType: ServiceType;

  constructor(
    type: ServiceType,
    protected http: HttpClient,
    protected notifier: NotificationsService
  ) {
    this.context = new RedHerdApiContext(RedHerdRootEndpoint.assets);
    this.serviceType = type;
  }

  public get Token(): string {
    return this.context.Token;
  }
  
  /** POST: enable new service for an asset */
  protected enable<T>(asset: Asset | number, params?: T): Observable<ServiceResponse> {
    return this.provide(asset, ServiceOperation.enable, params);
  }

  /** POST: disable a previously requested service */
  protected disable(asset: Asset | number): Observable<ServiceResponse> {
    return this.provide(asset, ServiceOperation.disable);
  }

  protected provide<T>(asset: Asset | number, operation: ServiceOperation, params?: T): Observable<ServiceResponse> {
    const id = typeof asset === 'number' ? asset : asset.id;
    //const url = `${this.context.Url}/${id}/service`;
    const url = this.context.Token ? `${this.context.Url}/${id}/service?t=${this.context.Token}` : `${this.context.Url}/${id}/service`;
    const options = this.context.HttpOptions;
    const service : ServiceRequest<T> = { type: this.serviceType, params: params };
    const request : ServiceRequestEnvelope<T> = { operation: operation, service: service };

    return this.http.post<JSendResponse>(url, request, options)
      .pipe(
        map(res => { 
          let inspected = JSendResponseInspector.inspect<ServiceResponse>(res, this.notifier, RedHerdEntity.service);
          if (!inspected.data) {
            inspected.notify();
          }
          return inspected.data;
        }),   
        catchError(err => { return throwError(err); })
      );
  }
}
