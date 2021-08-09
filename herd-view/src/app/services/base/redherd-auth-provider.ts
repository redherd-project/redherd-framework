import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JSendResponse, JSendResponseInspector } from '../../bin/model/jsend';
import { RedHerdApiContext } from './redherd-api';
import { RedHerdRootEndpoint, RedHerdEntity } from '../../bin/model/base/redherd-common';
import { JwtToken } from '../../bin/model/token';
import { NotificationsService } from 'angular2-notifications';

export class RedHerdAuthProvider {
  protected context: RedHerdApiContext;

  constructor(protected http: HttpClient,
              protected notifier: NotificationsService) {
    this.context = new RedHerdApiContext(RedHerdRootEndpoint.login);
  }

  /** POST: user auth */
  public authenticate(username: string, password: string): Observable<JwtToken> {
    const url = `${this.context.Url}`;
    const options = this.context.HttpOptions;
    const request = { username: username, password: password };

    return this.http.post<JSendResponse>(url, request, options)
      .pipe(
        map(res => { 
          let inspected = JSendResponseInspector.inspect<string>(res, this.notifier, RedHerdEntity.token);
          if (!inspected.data) {
            inspected.notify();
          }
          return new JwtToken(inspected.data);
        }),
        catchError(err => { return throwError(err); })
      );
  }
}
