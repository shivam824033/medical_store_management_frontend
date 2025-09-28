import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css']
})
export class UnauthorizedComponent implements OnInit {

  constructor() {}


  ngOnInit(): void {

//    localStorage.clear();
    // Optionally, redirect to login page after a delay
    // setTimeout(() => {
    //   this.router.navigate(['/login']);
    // }, 3000); // Redirect after 3 seconds
  }


}
