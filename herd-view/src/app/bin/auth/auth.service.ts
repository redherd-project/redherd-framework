import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../../config';
import { User } from '../model/user';
import { Token } from '../model/token';
import { RedHerdAuthProvider } from '../../services/base/redherd-auth-provider';
import { SystemService } from '../../services/system.service';
import { NotificationsService } from 'angular2-notifications';


@Injectable({
  providedIn: 'root'
})
export class AuthService extends RedHerdAuthProvider {
  private loggedIn: BehaviorSubject<boolean>;
  private notificationOptions;

  private verifyAuthenticationToken() {
    let result: boolean;

    // Switched to sessionStorage API in order to mitigate the effect of the
    // browser dirty cache after multiple framework deploy
    //let token: Token = new Token(localStorage.getItem(Config.auth_token_store));
    let token: Token = new Token(sessionStorage.getItem(Config.auth_token_store));

    try
    {
      if (token.isEmpty()) {
        // No token stored
        result = false;
      }
      else if (token.isExpired()) {
        // The session is expired, logout
        this.logout();

        // Notify the expired session
        this.notifier.warn('Session expired', '', this.notificationOptions);
        result = false;
      }
      else {
        // There is a token stored, check if its seed matches the framework one
        this.systemService.getSystem()
          .subscribe(system => {
            if (system.seed.toUpperCase() != token.seed.toUpperCase()) {
              // The seeds do not match, logout
              this.logout();

              // Notify the invalid seed
              this.notifier.warn('Invalid seed detected', '', this.notificationOptions);
              result = false;
            }
            else {
              // All good
              result = true;
            }
          });
      }
    }
    catch
    {
      result = false;
    }
    return result;
  }

  get isLoggedIn() {
    if (this.verifyAuthenticationToken()) {
      this.loggedIn.next(true);
    }
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    protected http: HttpClient,
    protected systemService: SystemService,
    protected notifier: NotificationsService
  ) {
    super(http, notifier);
    this.loggedIn = new BehaviorSubject<boolean>(false);

    this.notificationOptions = {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      animate: 'fromRight'
    };
  }

  login(user: User): void {
    this.authenticate(user.username, user.password)
      .subscribe(token => {
        if (token) {
          // Switched to sessionStorage API in order to mitigate the effect of the
          // browser dirty cache after multiple framework deploy
          //localStorage.setItem(Config.auth_token_store, token);
          sessionStorage.setItem(Config.auth_token_store, token);

          this.loggedIn.next(true);
          this.router.navigate(['/']);
        }
      });
  }

  logout(): void {
    // Switched to sessionStorage API in order to mitigate the effect of the
    // browser dirty cache after multiple framework deploy
    //localStorage.removeItem(Config.auth_token_store);
    sessionStorage.removeItem(Config.auth_token_store);

    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}