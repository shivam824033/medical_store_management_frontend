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
  confirmPassword!: string;

  ngOnInit(): void {
  }
  loginRes = new LoginResponse();
  signupForm: UntypedFormGroup;
  signUpRequest = new SignUpRequest();
  roles = ["SELLER", "PUBLIC"];
  genderList = ["Male", "Female", "Other"];


  email: string = '';
  otp: string = '';
  message: string = '';
  otpSent: boolean = false;

  errorMessage: any;

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
    this.errorMessage = '';
    this.message = '';
    var fullName = this.signUpRequest.firstName + " " + this.signUpRequest.lastName;
    this.signUpRequest.fullName = fullName;

    if (this.signUpRequest.password !== this.confirmPassword) {
      this.errorMessage = "Password and Confirm Password should be same";
      return;
    }

    if (this.signUpRequest.otp === undefined || this.signUpRequest.otp === null || this.signUpRequest.otp === '') {
      this.errorMessage = "Please enter OTP";
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
        this.errorMessage = this.loginRes.errorMessage;
      }
    })
  }


  sendOtp() {
    this.errorMessage = '';
    this.message = '';
    if (this.signUpRequest.email) {
      this.signUpService.sendOtp(this.signUpRequest.email).subscribe((res: any) => {

        if (res.errorMessage == null) {

          this.message = res.response;
          this.otpSent = true;

        } else {
          this.errorMessage = res.errorMessage;
          this.otpSent = false;
        }

        setTimeout(() => {
          this.otpSent = false;
        }, 120000);

      });
    } else {
      this.errorMessage = "Please enter a valid email address.";
    }
  }

  otpResponse: any = {
    message: '',
    flag: false
  };
  verifyOtp() {
    if (this.signUpRequest.email) {
      this.signUpService.verifyOtp(this.signUpRequest.email, this.otp).subscribe((res: any) => {

        if (res.errorMessage == null) {

          this.otpResponse = res.response;
          this.otpSent = false;

        } else {
          this.errorMessage = res.errorMessage;
          this.otpSent = true;

        }
      });
    } else {
      this.errorMessage = "Please enter a valid email address.";
    }

  }

}
