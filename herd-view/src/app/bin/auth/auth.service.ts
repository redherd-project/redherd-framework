import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../../config';
import { User } from '../model/user';
import { JwtToken } from '../model/token';
import { RedHerdAuthProvider } from '../../services/base/redherd-auth-provider';
import { SystemService } from '../../services/system.service';
import { NotificationsService } from 'angular2-notifications';


@Injectable({
  providedIn: 'root'
})
export class AuthService extends RedHerdAuthProvider {
  private loggedIn: BehaviorSubject<boolean>;
  private notificationOptions;

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

  private async authenticationCheck(): Promise<boolean> {
    let token: JwtToken = new JwtToken(
      Config.single_instance ? sessionStorage.getItem(Config.auth_token_store) : localStorage.getItem(Config.auth_token_store)
    );

    try {
      if (token.isEmpty()) {
        // No token stored
        this.loggedIn.next(false);
      }
      else if (token.isExpired()) {
        // The session is expired, logout
        this.logout();
        this.loggedIn.next(false);

        // Notify the expired session
        this.notifier.warn('Session expired', '', this.notificationOptions);
      }
      else {
        // There is a token stored, check if its seed matches the framework one
        await this.systemService.getSystemPromise()
          .then(system => {
            if (system.seed.toUpperCase() != token.seed.toUpperCase()) {
              // The seeds do not match, logout
              this.logout();
              this.loggedIn.next(false);

              // Notify the invalid seed
              this.notifier.warn('Invalid seed detected', '', this.notificationOptions);
            }
            else {
              // All good
              this.loggedIn.next(true);
            }
          });
      }
    }
    catch (err) {
      console.log(err);
    }
    return this.loggedIn.getValue();
  }

  private doRouting() {
    this.authenticationCheck()
      .then(loggedIn => {
        if (loggedIn) {
          if (this.router.url.includes(Config.unauthenticated_landing_path)) {
            this.router.navigate([Config.authenticated_landing_path]);
          }
          else {
            this.router.navigate([this.router.url]);
          }
        }
        else {
          this.router.navigate([Config.unauthenticated_landing_path]);
        }
      });
  }

  get isLoggedIn() {
    // Trigger route evaluation based on the current authentication status
    this.doRouting();

    // Return the authentication status as observable object
    return this.loggedIn.asObservable();
  }

  login(user: User): void {
    this.authenticate(user.username, user.password)
      .subscribe(token => {
        if (token) {
          if (Config.single_instance) {
            sessionStorage.setItem(Config.auth_token_store, token.value);
          }
          else {
            localStorage.setItem(Config.auth_token_store, token.value);
          }

          // Trigger route evaluation after authentication status changed
          this.doRouting();
        }
      });
  }

  logout(): void {
    if (Config.single_instance) {
      sessionStorage.removeItem(Config.auth_token_store);
    }
    else {
      localStorage.removeItem(Config.auth_token_store);
    }

    // Trigger route evaluation after authentication status changed
    this.doRouting();
  }
}