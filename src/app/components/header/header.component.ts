import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Userdetails } from 'src/app/models/login';
import { GlobalService } from 'src/app/services/global.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  token!: string;
  sessionUserDetails = new Userdetails();
  private routerSubscription!: Subscription;

  constructor(private navService: GlobalService, private router: Router) { }

  ngOnInit(): void {
    this.readToken();

    // Subscribe to router events to update token on every navigation
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.readToken();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  readToken() {
    const token = localStorage.getItem('token');
    const userDetails = localStorage.getItem('UserDetails');
    if (token && userDetails) {
      this.token = token;
      Object.assign(this.sessionUserDetails, JSON.parse(userDetails));
    } else {
      // this.token = '';
      // this.sessionUserDetails = new Userdetails();
    }
  }

  logoutSession() {
    this.navService.logoutSession();
    window.location.reload();
  }
}
