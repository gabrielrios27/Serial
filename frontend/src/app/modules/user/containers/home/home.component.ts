import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Genre, PageTvShow, TvShow } from '../../interfaces/user';
import { Subject, takeUntil } from 'rxjs';

import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  tvShowCover: TvShow = {} as TvShow;
  tvShows: TvShow[] = [];
  tvShows_toSearch: TvShow[] = [];
  tvShows_toShow: TvShow[] = [];
  totalPages: number = 0; /*numero total de paginas que se obtienen de la API*/
  numbersPages: number[] =
    []; /*arreglo de numeros del 1 al pagesToShow, si se quieren mostrar todas entonces en createNumbersPagesArray() cambiar pagesToShow por totalPages*/
  pagesToShow: number = 100; /*cantidad de peliculas a mostrar en la paginación*/
  pageSelected: number = 1;
  arrowPagination: number = 1;
  translatePaginationNumber: number = 0;
  translatePaginationString: string = '0px';
  toSearch: string = '';
  quantity: number = 0;

  loading = false;
  openSearch: boolean;
  notFound: boolean;
  // Id de la card seleccionada -  se usa para voltear la carta si se selecciona otra
  idTvShowSelected: number;
  trailer: string | undefined;

  savedList: any;
  likedTvShows: any;
  getListEnd: boolean;
  allMyTvShows: any[];
  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(private _UserSvc: UserService, private _route: Router) {
    this.openSearch = false;
    this.notFound = false;
    this.idTvShowSelected = 0;
    this.trailer = undefined;
    this.getListEnd = false;
    this.allMyTvShows = [];
  }

  ngOnInit(): void {
    this.getTvShow();
    this.getLikedList();
    this.getSavedList();
  }

  getFromLclStg(key: string): any {
    let value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }
  saveInLclStg(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  // ----------------------
  getTvShow() {
    this._UserSvc
      .getTvShow(this.pageSelected)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: PageTvShow) => {
          data.results.length === 0
            ? (this.notFound = true)
            : (this.notFound = false);
          this.tvShows = data.results;
          this.checkSavedLiked(this.tvShows);

          let firstElement = this.tvShows.shift();
          if (firstElement) {
            this.tvShowCover = firstElement;
            this.getTvShowTrailer(firstElement.id);
          }

          this.totalPages = data.total_pages;
          this.tvShows_toShow = this.tvShows;
          console.log(this.tvShows_toShow);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  checkSavedLiked(tvs: TvShow[]) {
    tvs.map((tv: TvShow) => {
      tv.isLiked = false;
      tv.isSaved = false;
    });
  }
  onSavedOrLikedCover(type: string) {
    // type === 'saved'
    //   ? (this.tvShowCover.isSaved = !this.tvShowCover.isSaved)
    //   : (this.tvShowCover.isLiked = !this.tvShowCover.isLiked);
    if (type === 'like') {
      if (this.tvShowCover.isLiked) {
        console.log('Aqui endpoint de eliminar de liked');
        this.onDeleteLikeTvShow(this.tvShowCover.id);
      } else {
        console.log('Listo endpoint de guardar en favoritos');
        this.onLikeTvShow(this.tvShowCover);
      }
      this.tvShowCover.isLiked = !this.tvShowCover.isLiked;
    } else {
      if (this.tvShowCover.isSaved) {
        console.log('Aqui endpoint de eliminar de saved');
        this.onDeleteSavedTvShow(
          this.tvShowCover.id,
          this.tvShowCover.idListSaved
        );
        this.tvShowCover.isSaved = !this.tvShowCover.isSaved;
      } else {
        this.tvShowCover.isSaved = !this.tvShowCover.isSaved;
        this.tvShowCover.isSaved
          ? this._route.navigate(['./lists/', this.tvShowCover.id])
          : null;
      }
    }
  }
  onSavedOrLiked(type: string, id: number) {
    type === 'saved'
      ? (this.tvShowCover.isSaved = !this.tvShowCover.isSaved)
      : (this.tvShowCover.isLiked = !this.tvShowCover.isLiked);
  }

  loadMore() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    console.log('Load more.....');

    if (this.toSearch === '') {
      this.pageSelected += 1;
      console.log('_UserSvc');
      this._UserSvc
        .getTvShow(this.pageSelected)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: (data: PageTvShow) => {
            this.checkSavedLiked(data.results);
            let newTvShows = this.findIfLikedOrSaved(data.results);
            this.tvShows.push(...newTvShows);
            this.tvShows_toShow = this.tvShows;
            this.loading = false;
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.pageSelected += 1;
      this._UserSvc
        .getSearchTvShow(this.pageSelected, this.toSearch)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe({
          next: (data: PageTvShow) => {
            this.tvShows_toSearch.push(...data.results);
            this.totalPages = data.total_pages;
            this.tvShows_toShow = this.tvShows_toSearch;
            this.loading = false;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
  onOpenSearch(value: boolean) {
    this.openSearch = value;
  }
  namedGenre(genresNames: Genre[], listTvShows: TvShow[]) {
    listTvShows.map((item: TvShow) => {
      let genreSelected: Genre[] = genresNames.filter((gen: Genre) =>
        item.genre_ids.includes(gen.id)
      );
      item.genres = genreSelected;
    });
  }

  /*para buscar la informacion del input dentro de las cards mostradas en el home*/
  onSearch(e: string) {
    this.idTvShowSelected = 0;
    /*informacion a buscar, que viene desde el componente searcher*/
    this.toSearch = e;

    // lo siguiente se hace para volver la paginación a la pagina 1 cada vez que se busca algo
    this.arrowPagination = 1;
    this.translatePaginationNumber = 0;
    this.translatePaginationString = '0px';
    this.pageSelected = 1;

    /*vacío el arreglo en donde guardaremos las series que coincidan con la busqueda */
    this.tvShows_toSearch = [];
    if (e !== '') {
      this.getSearchTvShow();
    } else {
      /*si el input de busqueda esta vacio se muestra el arreglo de todas las series*/
      // this.getTvShow();
      this.tvShows_toShow = this.tvShows;
    }
    /*se calcula la cantidad de series mostradas*/
    this.quantity = this.tvShows_toShow.length;
  }
  getSearchTvShow() {
    this._UserSvc
      .getSearchTvShow(this.pageSelected, this.toSearch)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: PageTvShow) => {
          data.results.length === 0
            ? (this.notFound = true)
            : (this.notFound = false);
          this.tvShows_toSearch = data.results;
          this.tvShows_toSearch = this.findIfLikedOrSaved(
            this.tvShows_toSearch
          );

          this.totalPages = data.total_pages;
          this.tvShows_toShow = this.tvShows_toSearch;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {},
      });
  }
  getIdTvShowSelected(id: number) {
    this.idTvShowSelected = id;
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
  Search(toSearchVal: string) {}

  changeStatusLikeOrSave(
    tv: TvShow,
    isLikedOrIsSaved: string,
    actualStatus: boolean
  ) {
    const index = this.tvShows.findIndex((tvShow) => tvShow.id === tv.id);

    if (index !== -1) {
      if (isLikedOrIsSaved === 'isLiked') {
        this.tvShows[index].isLiked = !actualStatus;
        this.onLike(tv, actualStatus);
      } else {
        this.tvShows[index].isSaved = !actualStatus;
        this.onSave(tv, actualStatus);
      }

      if (this.toSearch === '') {
        this.tvShows_toShow = this.tvShows;
      } else {
        if (isLikedOrIsSaved === 'isLiked') {
          this.tvShows_toSearch[index].isLiked = !actualStatus;
          this.onLike(tv, actualStatus);
        } else {
          this.tvShows_toSearch[index].isSaved = !actualStatus;
          this.onSave(tv, actualStatus);
        }
        this.tvShows_toShow = this.tvShows_toSearch;
      }
    }
  }
  // LIKE a serie
  onLike(tv: any, isLiked: boolean) {
    if (isLiked) {
      this.onDeleteLikeTvShow(tv.id);
    } else {
      // this.onLikeTvShow(tv);
      console.log('estoy en home - se debe likear en el card ');
    }
    console.log('Despues de like this.tvShows: ', this.tvShows);
    console.log('Despues de like this.tvShows_toShow: ', this.tvShows_toShow);
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

  // SAVE a serie
  onSave(tvShow: any, isSaved: boolean) {
    if (isSaved) {
      //endp. eliminar de guardados con id y id-list
      this.onDeleteSavedTvShow(tvShow.id, tvShow.idListSaved);
    } else {
      // this._route.navigate(['./lists/' + tvShow.id]);
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
    this.tvShows.unshift(this.tvShowCover);
    this.tvShows = this.findIfLikedOrSaved(this.tvShows);
    let firstElement = this.tvShows.shift();
    if (firstElement) {
      this.tvShowCover = firstElement;
      this.getTvShowTrailer(firstElement.id);
    }
    this.tvShows_toShow = this.tvShows;
  }
  findIfLikedOrSaved(tvShowList: TvShow[]): TvShow[] {
    for (let tv of this.allMyTvShows) {
      tvShowList.map((tvShow: TvShow) => {
        if (tv.film.id === tvShow.id) {
          tvShow.isLiked = tv.film.isLiked;
          tvShow.isLiked = tv.film.isLiked;
          tvShow.isSaved = tv.film.isSaved;
          tvShow.idListSaved = tv.film.idListSaved;
        }
      });
    }
    console.log('findIfLikedOrSaved() - tvShowList: ', tvShowList);
    return tvShowList;
  }

  //Cliks en Card en Save o Like
  getTvShowToLikeFromCard(tv: TvShow) {
    console.log('to like from card: ', tv);
    this.changeStatusLikeOrSave(tv, 'isLiked', tv.isLiked);

    // this.onLike(tv, tv.isLiked);
  }
  getTvShowToSaveFromCard(tv: TvShow) {
    console.log('to save from card: ', tv);
    this.changeStatusLikeOrSave(tv, 'isSaved', tv.isLiked);

    // this.onSave(tv, tv.isSaved);
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
