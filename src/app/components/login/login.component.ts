import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login, LoginResponse } from 'src/app/models/login';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginReq = new Login();
  loginRes = new LoginResponse();
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private loginService: GlobalService, private route: Router) {

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
   }



  

  ngOnInit(): void {

  }

  doLogin() {
    console.log("login res" + this.loginReq)
    this.loginService.login(this.loginForm.value).subscribe(data => {

      console.log("login response" + data);
      Object.assign(this.loginRes, data);


      if (this.loginRes.errorMessage == null) {
        console.log("token" + this.loginRes.accessToken);
        localStorage.setItem("token", this.loginRes.accessToken);
        localStorage.setItem("UserDetails", JSON.stringify(this.loginRes.response))
        // if (this.loginRes.response?.roles === 'OWNER') {
        //   this.route.navigate(['/owner']);
        // } else if (this.loginRes.response?.roles === 'SELLER') {
        //   this.route.navigate(['/seller']);
        // } else {
        //   this.route.navigate(['/public']);
        // }
        //this.route.navigate(['']);
        window.location.reload();

      } else {
        console.log("error" + this.loginRes.errorMessage);
      }

    });



  }


}
