import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../../config';
import { User } from '../model/user';
import { RedHerdAuthProvider } from '../../services/base/redherd-auth-provider';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends RedHerdAuthProvider {
  private loggedIn: BehaviorSubject<boolean>;

  get isLoggedIn() {
    if (this.context.Token) {
      this.loggedIn.next(true);
    }
    return this.loggedIn.asObservable();
  }

  constructor(
    private router: Router,
    protected http: HttpClient,
    protected notifier: NotificationsService
  ) {
    super(http, notifier);
    this.loggedIn = new BehaviorSubject<boolean>(false);
  }

  login(user: User): void {
    //if (this.context.Token)
    //{
    //  this.loggedIn.next(true);
    //  this.router.navigate(['/']);
    //}
    //else
    //{
      this.authenticate(user.username, user.password)
        .subscribe(token => {
          if (token) {
            localStorage.setItem(Config.auth_token_store, token);

            this.loggedIn.next(true);
            this.router.navigate(['/']);
          }
        });
    //}
  }

  logout(): void {
    localStorage.removeItem(Config.auth_token_store);

    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}