import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../models/login';
import { ProductDetails } from '../models/product-details';
import { map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

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


  constructor(private http: HttpClient) { }

  login(loginRequest: Login) {
    return this.http.post(
      `${this.baseUrl}/api/auth/login`,loginRequest,{ withCredentials: true }
    );
  }

  logoutSession() {
    console.log("home")
    const token = localStorage.getItem('token');
    const userDetails = localStorage.getItem('UserDetails');
    if (token !== null && token !== undefined && userDetails !== null && userDetails !== undefined) {
      localStorage.removeItem('token');
      localStorage.removeItem('UserDetails');
      return this.http.get(`${this.baseUrl}/api/auth/logout`);
    }
    return;
  }

  signUp(signupRequest: any) {
    return this.http.post(`${this.baseUrl}/api/auth/signUp`, signupRequest, { withCredentials: true });
  }

  generateKey() {
    return this.http.get(`${this.baseUrl}/api/owner/generatekey`);
  }

  addProduct(product: ProductDetails) {
    return this.http.post(`${this.baseUrl}/api/seller/addProduct`, product);
  }

  searchSellerProduct(term: string) {
    if (term === '') {
      return of([]);
    }
    term = term.trim();
    const PARAMS = new HttpParams({});
    return this.http.get(`${this.baseUrl}/api/public/getMasterProduct`, {
      params: PARAMS.set('keyword', term)
    }).pipe(
        map((response: any) => response['response']))
  }

  getSellerProduct(term: string) {
    if (term === '') {
      return of([]);
    }
    term = term.trim();
    const PARAMS = new HttpParams({});
    return this.http.get(`${this.baseUrl}/api/public/getSellerProduct`, {
      params: PARAMS.set('keyword', term).set('storeId', 421302)
    }).pipe(
        map((response: any) => response['response']))
  }

    upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    let endpoint = '';

    // Detect file type by extension
    if (file.name.endsWith('.csv')) {
      endpoint = `${this.baseUrl}/api/seller/csv`;
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      endpoint = `${this.baseUrl}/api/seller/excel`;
    } else {
      throw new Error('Unsupported file type');
    }

    const req = new HttpRequest('POST', endpoint, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

}
