import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse } from 'src/app/models/login';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {


  ngOnInit(): void {
  }
  loginRes = new LoginResponse();
  signupForm: FormGroup;
  roles = ["SELLER", "PUBLIC"];

  errorMessage:any;

  constructor(private fb: FormBuilder, private signUpService: GlobalService, private route: Router) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      accountStatus: ['active', [Validators.required]],
      roles: ['', [Validators.required]],
      storeName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      secretKey: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // onSubmit() {
  //   if (this.signupForm.valid) {
  //     console.log('Form Data:', this.signupForm.value);
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }

  onSubmit() {
    console.log('registration Details:', this.signupForm.value);
    this.signUpService.signUp(this.signupForm.value).subscribe(data => {

      Object.assign(this.loginRes, data);


      if (this.loginRes.errorMessage == null) {
        console.log("token" + this.loginRes.accessToken);
        localStorage.setItem("token", this.loginRes.accessToken);
        localStorage.setItem("UserDetails", JSON.stringify(this.loginRes.response))
        //this.route.navigate(['']);
        window.location.reload();
      } else {
        console.log("error" + this.loginRes.errorMessage);
        this.errorMessage=this.loginRes.errorMessage;
      }
    })
  }


}
