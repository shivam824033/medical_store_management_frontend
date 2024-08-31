import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../models/login';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'observe': 'response'
  })
}

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  baseUrl = "http://localhost:8080";

  constructor(private http:HttpClient) { }

  login(loginRequest: Login){
    return this.http.post(`${this.baseUrl}/api/auth/login`, loginRequest)
  }

  logoutSession(){
    console.log("home")
    const token = localStorage.getItem('token');
    const userDetails = localStorage.getItem('UserDetails');
    if(token!==null && token!==undefined && userDetails!==null && userDetails!==undefined){
      localStorage.removeItem('token');
      localStorage.removeItem('UserDetails');
      return this.http.get(`${this.baseUrl}/api/auth/logout`);
    }
    return ;
  }

  signUp(signupRequest: any){
    return this.http.post(`${this.baseUrl}/api/auth/signUp`, signupRequest)
  }

  generateKey(){
    return this.http.get(`${this.baseUrl}/api/owner/generatekey`)
  }

}
