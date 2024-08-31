import { Component, OnInit } from '@angular/core';
import { Userdetails } from 'src/app/models/login';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private homeService: GlobalService) { }

  token!: string;
  sessionUserDetails = new Userdetails();

  loginFlag!: boolean;
  signupFlag!: boolean;
  ownerFlag!: boolean;
  sellerFlag!: boolean;
  publicFlag!: boolean;

  ngOnInit(): void {
   
    this.loginFlag = false;
    this.signupFlag = false;
    this.ownerFlag = false;
    this.sellerFlag = false;
    this.publicFlag = false;

    console.log("home")
    const token = localStorage.getItem('token');
    const userDetails = localStorage.getItem('UserDetails');
    if (token !== null && token !== undefined && userDetails !== null && userDetails !== undefined) {
      this.token = token;
      Object.assign(this.sessionUserDetails, JSON.parse(userDetails));
      console.log("userdetails", this.sessionUserDetails)
      if (this.sessionUserDetails.roles === 'OWNER') {
        this.ownerFlag = true;
      } else if (this.sessionUserDetails.roles === 'SELLER') {
        this.sellerFlag = true;
      } else {
        this.publicFlag = true;
      }
    }

  }

  doLogin() {
    this.loginFlag = true;
    this.signupFlag = false;
  }

  signUp() {
    this.signupFlag = true;
    this.loginFlag = false;
  }

  logoutSession() {

    this.homeService.logoutSession();
    window.location.reload();
  }

}
