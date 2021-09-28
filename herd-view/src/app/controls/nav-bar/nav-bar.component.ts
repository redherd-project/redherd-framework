import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../bin/auth/auth.service'

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  isLoggedIn$: Observable<boolean>;
  isHandset$: Observable<boolean>;

  @ViewChild('drawer') sidenav: MatSidenav;

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  }

  ngOnInit() {}

  public onLogout(): void {
    this.authService.logout();
  }

  public toggle(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }
}
