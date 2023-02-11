import { Component, OnDestroy, OnInit } from '@angular/core';
import { Genre, PageTvShow, TvShow } from '../../interfaces/user';
import { Subject, takeUntil } from 'rxjs';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  images: any[] = [
    'image 22',
    'image 23',

    'image 25',
    'image 26',

    'image 29',

    'image 31',
    'image 32',
    'image 33',
    'image 34',
  ];
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
  genres: Genre[];
  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(private _UserSvc: UserService) {
    this.genres = [
      {
        id: 37,
        name: 'Western',
      },
      {
        id: 10768,
        name: 'War & Politics',
      },
      {
        id: 10767,
        name: 'Talk',
      },
      {
        id: 10766,
        name: 'Soap',
      },
      {
        id: 10765,
        name: 'Sci-Fi & Fantasy',
      },
      {
        id: 10764,
        name: 'Reality',
      },
      {
        id: 10763,
        name: 'News',
      },
      {
        id: 9648,
        name: 'Mystery',
      },
      {
        id: 10762,
        name: 'Kids',
      },
      {
        id: 10751,
        name: 'Family',
      },
      {
        id: 18,
        name: 'Drama',
      },
      {
        id: 99,
        name: 'Documentary',
      },
      {
        id: 80,
        name: 'Crime',
      },
      {
        id: 35,
        name: 'Comedy',
      },
      {
        id: 16,
        name: 'Animation',
      },
      {
        id: 10759,
        name: 'Action & Adventure',
      },
    ];
  }

  ngOnInit(): void {
    this.getTvShow();
  }

  getTvShow() {
    this._UserSvc
      .getTvShow(this.pageSelected)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: PageTvShow) => {
          this.tvShows = data.results;
          let firstElement = this.tvShows.shift();
          if (firstElement) {
            this.tvShowCover = firstElement;
          }
          this.totalPages = data.total_pages;
          this.tvShows_toShow = this.tvShows;
          console.log(this.tvShows_toShow);
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.CountQuantity();
          this.createNumbersPagesArray();
          // this.ReWriteAtFilterChange(this.toSearch);
          console.log('Request trending complete');
          this.namedGenre(this.genres, this.tvShows_toShow);
        },
      });
  }

  namedGenre(genresNames: Genre[], listTvShows: TvShow[]) {
    listTvShows.map((item: TvShow) => {
      let genreSelected: Genre[] = genresNames.filter((gen: Genre) =>
        item.genre_ids.includes(gen.id)
      );
      item.genres = genreSelected;
    });
  }

  getSearchTvShow() {
    this._UserSvc
      .getSearchTvShow(this.pageSelected, this.toSearch)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: PageTvShow) => {
          this.tvShows = data.results;
          this.totalPages = data.total_pages;
          this.tvShows_toShow = this.tvShows;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.CountQuantity();
          this.createNumbersPagesArray();
          console.log('Request series to search complete');
        },
      });
  }
  createNumbersPagesArray() {
    this.numbersPages = [];
    if (this.totalPages > this.pagesToShow) {
      for (let i = 1; i <= this.pagesToShow; i++) {
        this.numbersPages.push(i);
      }
    } else {
      for (let i = 1; i <= this.totalPages; i++) {
        this.numbersPages.push(i);
      }
    }
  }
  /*CountQuantity: se calcula la cantidad de peliculas o series mostradas*/
  CountQuantity() {
    this.quantity = this.tvShows_toShow.length;
  }

  onClickPage(page: number) {
    this.pageSelected = page;
    if (this.toSearch == '') {
      this.getTvShow();
    } else {
      this.getSearchTvShow();
    }
  }
  onClickRightArrowPagination() {
    if (this.arrowPagination < 17) {
      this.translatePaginationNumber = this.arrowPagination * -205;
      this.translatePaginationString = `${this.translatePaginationNumber}px`;
      this.arrowPagination++;
    }
  }
  onClickLeftArrowPagination() {
    if (this.arrowPagination > 0) {
      this.arrowPagination--;
      this.translatePaginationNumber = this.translatePaginationNumber + 205;
      this.translatePaginationString = `${this.translatePaginationNumber}px`;
    }
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
