import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PageTvShow, TvShow } from '../interfaces/user';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  api_key: string = '0167913abe154169ea9d85e3e8a3e7da';
  baseUrl: string = 'https://api.themoviedb.org/3';
  subUrl: string = '/tv/popular';
  subUrlToSearch: string = '/search/tv';
  headers = new HttpHeaders().set(
    'Authorization',
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMTY3OTEzYWJlMTU0MTY5ZWE5ZDg1ZTNlOGEzZTdkYSIsInN1YiI6IjYyMTU0ZWRhMGU0ZmM4MDA0NDExNjZlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8-i63xqhXGI5bCPXp0dWpPktcxIJt_CUToTH5Sneyc8'
  ); //token para la autorización de la API de TMBD version 4
  constructor(private _http: HttpClient) {}
  getTvShow(page: number): Observable<PageTvShow> {
    let params = new HttpParams()
      .set('language', 'en')
      .set('page', page.toString());

    return this._http.get<PageTvShow>(this.baseUrl + this.subUrl, {
      headers: this.headers,
      params: params,
    });
  }
  getSearchTvShow(page: number, toSearch: string): Observable<PageTvShow> {
    let params = new HttpParams()
      .set('language', 'en')
      .set('query', toSearch)
      .set('page', page.toString())
      .set('include_adult', false);

    return this._http.get<PageTvShow>(this.baseUrl + this.subUrlToSearch, {
      headers: this.headers,
      params: params,
    });
  }
}
