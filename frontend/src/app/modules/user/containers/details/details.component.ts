import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Episode, SeasonData, TvShow } from './../../interfaces/user';
import { Subject, takeUntil } from 'rxjs';

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

  // subscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(
    private _userSvc: UserService,
    private _rutaActiva: ActivatedRoute
  ) {
    this.idFilm = 0;
    this.tvShow = {} as TvShow;
    this.seasons = [];
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
  getAllDataSeason() {
    for (let i = 1; i < this.tvShow.number_of_seasons + 1; i++) {
      console.log('i: ', i);

      this.getSeasonTvShow(this.idFilm, i);
    }
    console.log(this.seasons);
    this.addDirectorNameToEpisodes(this.seasons);
  }
  getSeasonTvShow(id: number, season: number) {
    this._userSvc
      .getSeasonTvShow(id, season)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (dataSeason: SeasonData) => {
          this.seasons.push(dataSeason);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  addDirectorNameToEpisodes(seasonDat: SeasonData[]) {
    console.log('addDirectorNameToEpisodes()', seasonDat);
    console.log('addDire', this.seasons);
    console.log('addDire', seasonDat[1]);
    console.log('addDire', seasonDat[2]);
    console.log('addDire', seasonDat[3]);
    console.log('addDire', seasonDat[4]);

    for (var seas of seasonDat) {
      console.log('dentro de for.. seasonDataaaaa', seas);
    }
    console.log('despues de for..');

    // seasonData.map((season: SeasonData) => {
    //   console.log('dentro de seasonData');

    //   season.episodes.map((episode: Episode) => {
    //     // episode.director = episode.crew.find(
    //     //   (crew: any) => crew.job === 'Director'
    //     // )?.name;
    //     console.log(
    //       episode.crew.filter((crew: any) => crew.job === 'Director')
    //     );
    //   });
    // });
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
