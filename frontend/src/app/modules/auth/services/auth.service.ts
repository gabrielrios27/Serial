import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserForm, UserLog } from '../interfaces/auth.interface';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// import axios from 'axios'
// import qs from 'qs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl: string;
  epSignUp: string;
  epLogIn: string;
  private rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  private clientId =
    '591408333352-mj91m76m2mufk2r16a15obil0507s6dn.apps.googleusercontent.com';
  private clientSecret = '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';
  // private redirectUri = 'http://localhost:3000';
  private redirectUri = 'https://serial-ivory.vercel.app';
  constructor(private _http: HttpClient) {
    this.baseUrl = 'https://serial-backend.onrender.com/';
    this.epSignUp = 'user/signup';
    this.epLogIn = 'user/signin';
  }
  signUp(email: string, password: string): Observable<any> {
    let user: UserForm = {
      email: email,
      password: password,
      name: 'No name',
      last_name: 'No last name',
    };
    return this._http.post<UserLog>(this.baseUrl + this.epSignUp, user);
  }
  logIn(email: string, password: string): Observable<any> {
    let user: UserForm = {
      email: email,
      password: password,
    };

    return this._http.post<UserLog>(this.baseUrl + this.epLogIn, user);
  }

  getGoogleOAuthURL(): string {
    const options = {
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };
    const query = new URLSearchParams(options);

    return `${this.rootUrl}?${query.toString()}`;
  }

  getGoogleOAuthTokens(codeVal: string): Observable<any> {
    const url = 'https://oauth2.googleapis.com/token';

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const values = {
      code: codeVal,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    };

    const body = new URLSearchParams(values).toString();

    return this._http.post<any>(url, body, { headers: headers });
  }
  getAuthFromDb(url: string): Observable<UserLog> {
    console.log('svc getAuthFromDb');

    return this._http.get<UserLog>(url);
  }
}
