import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { TvShow } from './../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit, OnDestroy {
  toSearch: string;
  btnSaved: boolean;
  isTypeList: boolean;
  user: any;
  savedList: any;
  savedListComplete: any;
  likedList: any;
  likedTvShows: any;
  listToShow: any;
  imgLikedList: any = [
    '/6wrUL1boBJIRlgwdmFKOlbhllDh.jpg',
    '/4AyYGYGbHXDcsJaXK9rrSUpCYPe.jpg',
    '/vQiryp6LioFxQThywxbC6TuoDjy.jpg',
    '/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg',
  ];
  imgSavedList: any = [
    {
      id: 1402,
      poster_path: '/xf9wuDcqlUPWABZNeDKPbZUjWx0.jpg',
    },
    {
      id: 1418,
      poster_path: '/ooBGRQBdbGzBxAVfExiO8r7kloA.jpg',
    },
    {
      id: 57243,
      poster_path: '/sz4zF5z9zyFh8Z6g5IQPNq91cI7.jpg',
    },
    {
      id: 1396,
      poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    },
  ];
  idToSave: number; // Para cuando el usuario dio click a guardar serie
  isSavedInThisList: number | null;
  tvShow: TvShow;
  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(
    private _UserSvc: UserService,
    private _rutaActiva: ActivatedRoute,
    private _route: Router
  ) {
    this.toSearch = '';
    this.btnSaved = true;
    this.isTypeList = false;
    this.idToSave = 0;
    this.isSavedInThisList = null;
    this.tvShow = {} as TvShow;
    this.likedList = [
      {
        id: 1,
        description: 'My Favourites',
        cover: '../../../../../assets/images/listDemo.png',
      },
    ];
  }

  ngOnInit(): void {
    this.getLikedList();
    this.getSavedList();

    this.isTypeList = this.getFromLclStg('isTypeList');
    this.btnSaved = this.getFromLclStg('btnSaved');
    this.getFromRoute();
  }
  getFromRoute() {
    let idToSaveRoute;
    this._rutaActiva.paramMap
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params: ParamMap) => {
        idToSaveRoute = params.get('id');
        if (idToSaveRoute) {
          this.idToSave = Number(idToSaveRoute);
          this.getTvShowById(this.idToSave);
          this.btnSaved = true;
        }
      });
  }
  onCreateList() {
    this._route.navigate(['./lists/mylist/new/' + this.idToSave]);
  }
  getTvShowById(id: number) {
    this._UserSvc
      .getTvShowById(id)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (tvShow: TvShow) => {
          this.tvShow = tvShow;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getLikedList() {
    this._UserSvc
      .getLikedList()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          // this.likedList = data.lists; //Cuando se escale esto traera las listas de otros usuarios likeadas
          this.likedTvShows = data.series;
          this.createImgCover(this.likedTvShows);
          console.log('this.likedTvShows: ', this.likedTvShows);
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
          this.savedListComplete = this.savedList;
          this.sortListTvShowSaved(this.savedList);
          console.log('this.savedList: ', this.savedList);
          this.listToShow = this.savedList;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getFromLclStg(key: string): any {
    let value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
  }
  createImgCover(tvs: any) {
    const imgs: string[] = [];
    for (let tv of tvs) {
      imgs.push(tv.film.poster_path);
    }
    imgs.sort(() => Math.random() - 0.5);
    this.imgLikedList = imgs.slice(0, 4);
  }
  sortListTvShowSaved(arrayLists: any) {
    arrayLists.map((list: any) => {
      list.cover.sort(() => Math.random() - 0.5);
      const descriptionParts = list.description.split(' / ');
      descriptionParts[0]
        ? (list.name = descriptionParts[0])
        : (list.name = 'List');
      descriptionParts[1]
        ? (list.description = descriptionParts[1])
        : (list.description = '');
    });
  }

  Search(toSearchVal: string) {
    console.log(toSearchVal);
    if (this.btnSaved) {
      console.log('this.listToShow: ', this.listToShow);
      if (toSearchVal === '') {
        this.savedList = this.savedListComplete;
      } else {
        this.savedList = this.savedList.filter(
          (item: any) =>
            item.name.toLowerCase().includes(toSearchVal.toLowerCase()) ||
            item.description.toLowerCase().includes(toSearchVal.toLowerCase())
        );
      }
    }
  }
  toogleLikedOrSaved(value: boolean) {
    this.btnSaved = value;
    this.saveInLclStg('btnSaved', this.btnSaved);
    if (value) {
      this.listToShow = this.savedList;
    } else {
      this.listToShow = this.likedList;
    }
  }
  toogleType() {
    this.isTypeList = !this.isTypeList;
    this.saveInLclStg('isTypeList', this.isTypeList);
  }
  saveInLclStg(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  //Para guardar serie en lista
  onSaveInList(idLista: number, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.isSavedInThisList = idLista;
    this.onAddTvShowToSaved(this.tvShow, idLista);
    setTimeout(() => {
      this.isSavedInThisList = null;
      this.idToSave = 0;
    }, 1500);
  }
  onAddTvShowToSaved(tv: TvShow, idList: number) {
    this._UserSvc
      .addTvShowToSaved(tv, idList)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          this.saveInLclStg('isTypeList', this.isTypeList);
          this.saveInLclStg('btnSaved', true);
          this._route.navigate(['./lists']);
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
