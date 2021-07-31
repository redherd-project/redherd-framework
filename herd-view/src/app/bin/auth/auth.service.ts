import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../../config';
import { User } from '../model/user';
import { RedHerdAuthProvider } from '../../services/base/redherd-auth-provider';
import { NotificationsService } from 'angular2-notifications';

import jwt_decode from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService extends RedHerdAuthProvider {
  private loggedIn: BehaviorSubject<boolean>;

  get isLoggedIn() {
    if (this.isTokenValid()) {
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

  isTokenValid() {
    let token = localStorage.getItem(Config.auth_token_store);
    if (!token) {
      return false;
    }

    let decoded_token = jwt_decode(token);

    let now = (new Date()).getTime();
    if (now <= decoded_token['exp'].valueOf()*1000) {
      return true;
    }

    // If the token is not valid anymore, logout
    this.logout();

    // Notify session expired
    this.notifier.warn('Session expired', '', {
      timeOut: 3000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      animate: 'fromRight'
    });

    return false;
  }

}