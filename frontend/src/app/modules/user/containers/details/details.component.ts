import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Episode,
  Review,
  ReviewsGral,
  SeasonData,
  TvShow,
} from './../../interfaces/user';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  idFilm: number;
  tvShow: TvShow;
  seasons: SeasonData[];
  reviews: Review[];
  panelOpenState: boolean;
  panelOpenStateReviews: boolean;
  seasonSelected: number;
  selectSea: number;
  page: number;
  trailers: any;
  // subscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(
    private _userSvc: UserService,
    private _rutaActiva: ActivatedRoute
  ) {
    this.idFilm = 0;
    this.tvShow = {} as TvShow;
    this.seasons = [];
    this.reviews = [];
    this.panelOpenState = false;
    this.panelOpenStateReviews = false;
    this.seasonSelected = 1;
    this.selectSea = 1;
    this.page = 1;
  }
  ngOnInit(): void {
    this.getIdFromRoute();
  }
  getIdFromRoute() {
    let idToShow;
    this._rutaActiva.paramMap
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params: ParamMap) => {
        idToShow = params.get('id');
      });
    this.idFilm = Number(idToShow);
    this.getTvShowById(this.idFilm);
    this.getReviews(this.page, this.idFilm);
    this.getTvShowTrailer(this.idFilm);
  }
  getTvShowById(id: number) {
    this._userSvc
      .getTvShowById(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (tvShow: TvShow) => {
          console.log(tvShow);
          this.tvShow = tvShow;
          this.getAllDataSeason();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getTvShowTrailer(id: number) {
    this._userSvc
      .getTvShowTrailer(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (trailersbd: any) => {
          console.log(trailersbd);
          for (let trailer of trailersbd.results) {
            trailer.type === 'Trailer'
              ? (this.trailers = trailer.key)
              : (this.trailers = '');
            console.log(this.trailers);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  async getAllDataSeason() {
    for (let i = 1; i < this.tvShow.number_of_seasons + 1; i++) {
      console.log('i: ', i);

      await this.getSeasonTvShow(this.idFilm, i);
    }

    this.addDirectorNameToEpisodes(this.seasons);
  }
  async getSeasonTvShow(id: number, season: number) {
    try {
      const dataSeason = await lastValueFrom(
        this._userSvc
          .getSeasonTvShow(id, season)
          .pipe(takeUntil(this.onDestroy$))
      );
      this.seasons.push(dataSeason);
    } catch (err) {
      console.log(err);
    }
  }

  addDirectorNameToEpisodes(seasonData: SeasonData[]) {
    seasonData.map((season: SeasonData) => {
      season.episodes.map((episode: Episode) => {
        episode.director = episode.crew.find(
          (crew: any) =>
            crew.job === 'Director' || crew.department === 'Directing'
        )?.name;
      });
    });
    console.log(seasonData);
  }
  onChangeSeason(seasonSelected: number) {
    console.log('season: ', seasonSelected);
    this.selectSea = Number(seasonSelected);
  }
  getReviews(page: number, id: number) {
    this._userSvc
      .getReviews(page, id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: ReviewsGral) => {
          console.log(data);
          this.reviews = data.results.reverse();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
