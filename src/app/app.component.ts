import { Component, OnInit } from '@angular/core';
import { Userdetails } from './models/login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  token!: string;
  sessionUserDetails = new Userdetails();

  ngOnInit(): void {

    console.log("app component")
    const token = localStorage.getItem('token');
    const userDetails = localStorage.getItem('UserDetails');
    if (token !== null && token !== undefined && userDetails !== null && userDetails !== undefined) {
      this.token = token;
      Object.assign(this.sessionUserDetails, JSON.parse(userDetails));
      console.log("userdetails", this.sessionUserDetails)
    }

  }

}
