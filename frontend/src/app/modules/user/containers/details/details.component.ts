import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
  trailer: string | undefined;
  likeTv: boolean;
  saveTv: boolean;

  savedList: any;
  likedTvShows: any;
  getListEnd: boolean;
  allMyTvShows: any[];
  // subscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(
    private _UserSvc: UserService,
    private _rutaActiva: ActivatedRoute,
    private _route: Router
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
    this.trailer = undefined;
    this.likeTv = false;
    this.saveTv = false;
    this.getListEnd = false;
    this.allMyTvShows = [];
  }
  ngOnInit(): void {
    this.getIdFromRoute();
    this.getLikedList();
    this.getSavedList();
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
    this._UserSvc
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
    this._UserSvc
      .getTvShowTrailer(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (trailersbd: any) => {
          console.log(trailersbd);
          this.trailer = '';
          for (let trailer of trailersbd.results) {
            trailer.type === 'Trailer'
              ? (this.trailer = trailer.key)
              : (this.trailer = '');
            console.log(this.trailer);
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
        this._UserSvc
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
    this._UserSvc
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
  // like a serie
  onLike(tv: any, isLiked: boolean) {
    console.log(tv);

    if (isLiked) {
      //endp. eliminar like
      this.likeTv = false;
      this.onDeleteLikeTvShow(tv.id);
    } else {
      this.likeTv = true;
      //endp. guardar en favoritos - like
      this.onLikeTvShow(tv);
    }
  }
  onLikeTvShow(tv: TvShow) {
    this._UserSvc
      .likeTvShow(tv)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          console.log('onLikeTvShow: ', data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  onDeleteLikeTvShow(id: number) {
    this._UserSvc
      .delteLikeTvShow(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          console.log('delteLikeTvShow data: ', data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  //save a serie
  onSave(tvShow: any, isSaved: boolean) {
    if (isSaved) {
      //endp. eliminar de guardados con id y id-list
      this.onDeleteSavedTvShow(tvShow.id, tvShow.idListSaved);
      this.saveTv = false;
    } else {
      this._route.navigate(['./lists/' + tvShow.id]);
      //navegar a /lists/:id
    }
  }
  onDeleteSavedTvShow(idTv: number, idListSaved: number) {
    this._UserSvc
      .deleteTvShowSaved(idTv, idListSaved)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          console.log('deleteTvShowSaved data: ', data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  //Obtener todos los liked y saved para saber si esa serie ya esta guardada o likeada
  getLikedList() {
    this._UserSvc
      .getLikedList()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          // this.likedList = data.lists;
          this.likedTvShows = data.series;
          this.likedTvShows.map((tv: any) => {
            tv.film.isLiked = true;
            tv.film.isSaved = false;
            tv.film.idListSaved = 0;
            tv.film.idGeneral = tv.id;
            tv.film.idListSaved = 0;
          });
          console.log('this.likedTvShows: ', this.likedTvShows);
          if (this.getListEnd) {
            // chekear coincidencias
            this.checkMatches();
          } else {
            this.getListEnd = true;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getSavedList() {
    this._UserSvc
      .getSavedList()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          this.savedList = data;
          for (let list of this.savedList) {
            list.list_movies.map((tv: any) => {
              tv.film.isLiked = false;
              tv.film.isSaved = true;
              tv.film.idListSaved = list.id;
              tv.film.idGeneral = tv.id;
            });
          }

          if (this.getListEnd) {
            // chekear coincidencias
            this.checkMatches();
            console.log('matches ');
          } else {
            this.getListEnd = true;
            console.log('no matches ');
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  checkMatches() {
    for (let list of this.savedList) {
      list.list_movies.map((tvSaved: any) => {
        this.likedTvShows.map((tvLiked: any) => {
          if (tvLiked.film.id === tvSaved.film.id) {
            tvSaved.film.isLiked = true;
            tvLiked.film.isSaved = true;
            tvLiked.film.idListSaved = list.id;
          }
        });
      });
      this.allMyTvShows.push(...list.list_movies);
    }
    this.allMyTvShows.push(...this.likedTvShows);
    console.log('this.allMyTvShows: ', this.allMyTvShows);

    this.findIfLikedOrSaved();
    // this.isTypeSaved
    //   ? (this.listToShow = this.savedList.find(
    //       (list: any) => list.id === this.idList
    //     ).list_movies)
    //   : (this.listToShow = this.likedTvShows);
  }
  findIfLikedOrSaved() {
    for (let tv of this.allMyTvShows) {
      if (tv.film.id === this.tvShow.id) {
        this.tvShow.isLiked = tv.film.isLiked;
        this.tvShow.isLiked = tv.film.isLiked;
        this.tvShow.isSaved = tv.film.isSaved;
        this.tvShow.idListSaved = tv.film.idListSaved;
        this.likeTv = tv.film.isLiked;
        this.saveTv = tv.film.isSaved;
        console.log('this.likeTv: ', this.likeTv);
      }
    }
    console.log('findIfLikedOrSaved() - this.tvShow: ', this.tvShow);
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
