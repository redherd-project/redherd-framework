import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { RedHerdServiceProvider } from './base/redherd-service-provider';
import { ServiceResponse, ServiceType } from '../bin/model/service';
import { Asset } from '../bin/model/asset';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class RtspRedirectorService extends RedHerdServiceProvider {

  constructor(
    protected http: HttpClient,
    protected notifier: NotificationsService
  ) {
    super(ServiceType.rtsp_redirector, http, notifier);
  }

  /** POST: enable new web proxy service for an asset */
  public start(asset: Asset | number): Observable<ServiceResponse> {
    return this.enable(asset);
  }

  /** POST: disable a previously requested web proxy service */
  public stop(asset: Asset | number): Observable<ServiceResponse> {
    return this.disable(asset);
  }
}