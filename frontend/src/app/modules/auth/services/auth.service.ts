import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string;
  epSignUp: string;
  epLogIn: string;
  constructor(private _http: HttpClient) {
    this.baseUrl = 'https://serial-backend.onrender.com/';
    this.epSignUp = 'user/signup';
    this.epLogIn = 'user/signin';
  }
  signUp(email: string, password: string) {
    return this._http.post<any>(this.baseUrl + this.epSignUp, {
      email,
      password,
    });
  }
  logIn(email: string, password: string) {
    return this._http.post<any>(this.baseUrl + this.epLogIn, {
      email,
      password,
    });
  }
}
