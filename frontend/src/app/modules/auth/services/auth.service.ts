import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
  signUp(email: string, password: string): Observable<any> {
    let user = {
      email: email,
      password: password,
      name: 'No name',
      last_name: 'No last name',
    };
    return this._http.post<any>(this.baseUrl + this.epSignUp, user);
  }
  logIn(email: string, password: string): Observable<any> {
    let user = {
      email: email,
      password: password,
    };
    console.log('user: ', user);

    return this._http.post<any>(this.baseUrl + this.epLogIn, user);
  }
}
