import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginResponse, SignUpRequest } from 'src/app/models/login';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  confirmPassword!:string;

  ngOnInit(): void {
  }
  loginRes = new LoginResponse();
  signupForm: UntypedFormGroup;
  signUpRequest = new SignUpRequest();
  roles = ["SELLER", "PUBLIC"];
  genderList = ["Male", "Female", "Other"];

  errorMessage:any;

  constructor(private fb: UntypedFormBuilder, private signUpService: GlobalService, private route: Router) {
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
    console.log('registration Details:', this.signUpRequest);
    if(this.signupForm.invalid){
      this.errorMessage="Please fill all required fields";
      return;
    }
    var fullName = this.signUpRequest.firstName + " " + this.signUpRequest.lastName;
    this.signUpRequest.fullName=fullName;

    if(this.signUpRequest.password !== this.confirmPassword){
      this.errorMessage="Password and Confirm Password should be same";
      return;
    }
    this.signUpService.signUp(this.signUpRequest).subscribe(data => {

      Object.assign(this.loginRes, data);


      if (this.loginRes.errorMessage == null) {
        console.log("token" + this.loginRes.accessToken);
        localStorage.setItem("token", this.loginRes.accessToken);
        localStorage.setItem("UserDetails", JSON.stringify(this.loginRes.response))
        this.route.navigate(['']);
       // window.location.reload();
      } else {
        console.log("error" + this.loginRes.errorMessage);
        this.errorMessage=this.loginRes.errorMessage;
      }
    })
  }


}
