import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Userdetails } from 'src/app/models/login';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  token!: string;
  sessionUserDetails = new Userdetails();

  constructor(private navService: GlobalService, private route: Router) { }

  ngOnInit(): void {

    console.log("home")
    const token = localStorage.getItem('token');
    const userDetails = localStorage.getItem('UserDetails');
    if(token!==null && token!==undefined && userDetails!==null && userDetails!==undefined){
       this.token = token;
      Object.assign( this.sessionUserDetails, JSON.parse(userDetails) );
      console.log("userdetails", this.sessionUserDetails)
    }
    
  }

  logoutSession(){

    this.navService.logoutSession();
    window.location.reload();
  }

}
