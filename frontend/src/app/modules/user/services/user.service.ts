import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PageTvShow, TvShow } from '../interfaces/user';
import { ReviewsGral, SeasonData } from './../interfaces/user';

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
  // BD SEBA BACKEND
  user: any;
  baseUrlBack: string;
  epSavedList: string;

  epLikedList: string;

  // epListLiked: string;
  epCreateList: string;
  epLikeTvShow: string;
  epAddTvShow: string;
  epDeleteLike: string;
  epDeleteSaved: string;
  epDeleteListComplete: string;
  constructor(private _http: HttpClient) {
    this.baseUrlBack = 'https://serial-backend.onrender.com/';
    this.epSavedList = 'list/client/all';

    this.epLikedList = 'like/client';

    // this.epListLiked='/like/client' // /:id   --no funciona
    this.epCreateList = 'list/create';
    this.epLikeTvShow = 'like';
    this.epAddTvShow = 'list/add';
    this.epDeleteLike = 'like/remove';
    this.epDeleteSaved = 'list/remove';
    this.epDeleteListComplete = 'list/remove/';
  }
  getUserToken() {
    let tokenJSON = localStorage.getItem('user');

    if (tokenJSON) {
      this.user = JSON.parse(tokenJSON);
      console.log('token: ', this.user);
    }
  }
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
  getTvShowById(id: number): Observable<TvShow> {
    let params = new HttpParams().set('language', 'en');

    return this._http.get<TvShow>(this.baseUrl + '/tv/' + id, {
      headers: this.headers,
      params: params,
    });
  }
  getSeasonTvShow(id: number, season: number): Observable<SeasonData> {
    let params = new HttpParams().set('language', 'en');

    return this._http.get<SeasonData>(
      this.baseUrl + '/tv/' + id + '/season/' + season,
      {
        headers: this.headers,
        params: params,
      }
    );
  }

  getReviews(page: number, id: number): Observable<ReviewsGral> {
    console.log('svc reviews');

    let params = new HttpParams()
      .set('language', 'en')
      .set('page', page.toString());

    return this._http.get<ReviewsGral>(
      this.baseUrl + '/tv/' + id + '/reviews',
      {
        headers: this.headers,
        params: params,
      }
    );
  }
  getLikedList(): Observable<any> {
    console.log('svc LikedList');
    let tokenJSON = localStorage.getItem('user');

    if (tokenJSON) {
      this.user = JSON.parse(tokenJSON);
    }
    const token = this.user.token;

    const headersBack = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );

    return this._http.get<any>(this.baseUrlBack + this.epLikedList, {
      headers: headersBack,
    });
  }
  getSavedList(): Observable<any> {
    console.log('svc SavedList');
    let tokenJSON = localStorage.getItem('user');

    if (tokenJSON) {
      this.user = JSON.parse(tokenJSON);
    }
    const token = this.user.token;

    const headersBack = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );
    console.log(this.user);

    return this._http.get<any>(this.baseUrlBack + this.epSavedList, {
      headers: headersBack,
    });
  } ///tv/{tv_id}/videos
  getTvShowTrailer(id: number): Observable<any> {
    let params = new HttpParams().set('language', 'en');

    return this._http.get<any>(this.baseUrl + '/tv/' + id + '/videos', {
      headers: this.headers,
      params: params,
    });
  }
  likeTvShow(tvShow: any): Observable<any> {
    console.log('svc likeTvShow', tvShow);
    let userJson = localStorage.getItem('user');

    if (userJson) {
      this.user = JSON.parse(userJson);
    }
    const token = this.user.token;

    const headersBack = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );
    let body;
    if (tvShow.year) {
      body = {
        film: {
          id: tvShow.id,
          name: tvShow.title,
          year: tvShow.year,
          poster_path: tvShow.poster_path,
          backdrop_path: tvShow.backdrop_path,
        },
      };
    } else {
      body = {
        film: {
          id: tvShow.id,
          name: tvShow.name,
          year: tvShow.first_air_date.substring(0, 4),
          poster_path: tvShow.poster_path,
          backdrop_path: tvShow.backdrop_path,
        },
      };
    }

    console.log('body : ', body);

    return this._http.post<any>(this.baseUrlBack + this.epLikeTvShow, body, {
      headers: headersBack,
    });
  }
  delteLikeTvShow(id: number): Observable<any> {
    console.log('svc delteLikeTvShow', id);
    let userJson = localStorage.getItem('user');

    if (userJson) {
      this.user = JSON.parse(userJson);
    }
    const token = this.user.token;

    const headersBack = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );
    let body = {
      serieId: id,
    };
    console.log('body : ', body);

    return this._http.post<any>(this.baseUrlBack + this.epDeleteLike, body, {
      headers: headersBack,
    });
  }
  addTvShowToSaved(tvShow: TvShow, idList: number): Observable<any> {
    console.log('svc addTvShow', tvShow);
    let userJson = localStorage.getItem('user');

    if (userJson) {
      this.user = JSON.parse(userJson);
    }
    const token = this.user.token;

    const headersBack = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );
    let body = {
      listId: idList,
      films: [
        {
          id: tvShow.id,
          title: tvShow.name,
          year: Number(tvShow.first_air_date.substring(0, 4)),
          poster_path: tvShow.poster_path,
          backdrop_path: tvShow.backdrop_path,
        },
      ],
    };
    console.log('body to save: ', body);

    return this._http.post<any>(this.baseUrlBack + this.epAddTvShow, body, {
      headers: headersBack,
    });
  }
  deleteTvShowSaved(idTv: number, idListSaved: number): Observable<any> {
    console.log('svc delteLikeTvShow idTv: ', idTv);
    console.log('svc delteLikeTvShow idListSaved: ', idListSaved);
    let userJson = localStorage.getItem('user');

    if (userJson) {
      this.user = JSON.parse(userJson);
    }
    const token = this.user.token;

    const headersBack = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );
    let body = {
      listId: idListSaved,
      films: [idTv],
    };
    console.log('body : ', body);

    return this._http.post<any>(this.baseUrlBack + this.epDeleteSaved, body, {
      headers: headersBack,
    });
  }
  createNewList(description: string): Observable<any> {
    console.log('svc createNewList description', description);
    let userJson = localStorage.getItem('user');

    if (userJson) {
      this.user = JSON.parse(userJson);
    }
    const token = this.user.token;

    const headersBack = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );
    let body = {
      description: description,
    };
    console.log('body to create: ', body);

    return this._http.post<any>(this.baseUrlBack + this.epCreateList, body, {
      headers: headersBack,
    });
  }
  deleteListComplete(id: number): Observable<any> {
    console.log('svc deleteListComplete', id);
    let userJson = localStorage.getItem('user');

    if (userJson) {
      this.user = JSON.parse(userJson);
    }
    const token = this.user.token;

    const headersBack = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );

    return this._http.delete<any>(
      this.baseUrlBack + this.epDeleteListComplete + id,
      {
        headers: headersBack,
      }
    );
  }
}
