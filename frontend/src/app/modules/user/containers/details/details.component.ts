import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Episode, SeasonData, TvShow } from './../../interfaces/user';
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
  panelOpenState: boolean;
  panelOpenStateReviews: boolean;
  seasonSelected: number;
  selectSea: number;
  // subscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(
    private _userSvc: UserService,
    private _rutaActiva: ActivatedRoute
  ) {
    this.idFilm = 0;
    this.tvShow = {} as TvShow;
    this.seasons = [];
    this.panelOpenState = false;
    this.panelOpenStateReviews = false;
    this.seasonSelected = 1;
    this.selectSea = 1;
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
  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
