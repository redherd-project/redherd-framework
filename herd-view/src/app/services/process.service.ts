import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RedHerdApi } from './base/redherd-api';
import { RedHerdEntity, RedHerdRootEndpoint } from '../bin/model/base/redherd-common';
import { Process } from '../bin/model/process';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class ProcessService extends RedHerdApi {
  
  constructor(
    protected http: HttpClient,
    protected notifier: NotificationsService
  ) {
    super(RedHerdRootEndpoint.processes, http, notifier);
  }

  /** GET: retrieve processes from server */
  public getProcesses(): Observable<Process[]> {
    return this.getAll(RedHerdEntity.processes);
  }

  /** GET: retrieve process by id */
  public getProcess(id: number): Observable<Process> {
    return this.get(RedHerdEntity.process, id);
  }

  /** DELETE: delete process from server */
  public deleteProcess(process: Process | number): Observable<boolean> {
    const id = typeof process === 'number' ? process : process.id;

    return this.delete(id);
  }
}
