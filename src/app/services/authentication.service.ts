import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseUrl: string = environment.baseUrl;
  private registerUserUrl = "Authenticate/Register";
  private loginUserUrl = "Authenticate/Login";

  constructor(private http: HttpClient) { }

  registerUser(userInfo: any) {
    let url = `${this.baseUrl}/${this.registerUserUrl}`
    return this.http.post(url, userInfo, {})
  }

  loginUser(userInfo: any) {
    let url = `${this.baseUrl}/${this.loginUserUrl}`
    return this.http.post(url, userInfo, {})
  }
}
