import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { TvShow } from './../../interfaces/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss'],
})
export class MyListComponent implements OnInit {
  toSearch: string;
  isTypeList: boolean;

  idList: number;
  nameList: string;

  idTvShow: number;
  type: string;
  isTypeSaved: boolean;
  savedList: any;
  likedList: any;
  likedTvShows: any;
  listToShow: any;
  imgLikedList: any = [
    {
      id: 102567,
      poster_path: '/6wrUL1boBJIRlgwdmFKOlbhllDh.jpg',
    },
    {
      id: 62560,
      poster_path: '/oKIBhzZzDX07SoE2bOLhq2EE8rf.jpg',
    },
    {
      id: 37680,
      poster_path: '/vQiryp6LioFxQThywxbC6TuoDjy.jpg',
    },
    {
      id: 1399,
      poster_path: '/7WUHnWGx5OO145IRxPDUkQSh4C7.jpg',
    },
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
  idTvShowSelected: number;
  isDeleteItem: boolean;
  tvShowToDelete: TvShow;
  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(
    private _UserSvc: UserService,
    private _rutaActiva: ActivatedRoute,
    private _route: Router
  ) {
    this.toSearch = '';
    this.idList = 0;
    this.nameList = 'Lista n2';
    this.idTvShowSelected = 0;
    this.isTypeList = false;
    this.idTvShow = 0;
    this.type = 'saved';
    this.isTypeSaved = true;
    this.isDeleteItem = false; //Para modal de eliminar item
    this.tvShowToDelete = {} as TvShow;
  }

  ngOnInit(): void {
    this.isTypeList = this.getFromLclStg('isTypeListInsideList');
    console.log('this.isTypeList', this.isTypeList);
    this.getFromRoute();
  }
  getFromRoute() {
    let idToShow;
    let type;
    this._rutaActiva.paramMap
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((params: ParamMap) => {
        idToShow = params.get('id');
        type = params.get('type');
      });
    this.idTvShow = Number(idToShow);
    if (type === 'saved') {
      this.isTypeSaved = true;
      this.getSavedList();
    } else {
      this.isTypeSaved = false;
      this.getLikedList();
    }
  }
  getLikedList() {
    this._UserSvc
      .getLikedList()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          this.likedList = data.lists;
          this.likedTvShows = data.series;
          this.listToShow = this.likedTvShows;
          //Para modal-delete
          // this.idList = this.listToShow.id;
          // this.nameList = this.listToShow.description;

          console.log('this.likedList: ', this.likedList);
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
          console.log('this.savedList: ', this.savedList);
          this.listToShow = this.savedList;
          //Para modal-delete
          // this.idList = this.listToShow.id;
          // this.nameList = this.listToShow.description
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
  Search(toSearch: string) {
    console.log(toSearch);
  }

  toogleType() {
    this.isTypeList = !this.isTypeList;
    console.log('this.isTypeList: ', this.isTypeList);
    this.saveInLclStg('isTypeListInsideList', this.isTypeList);
  }
  saveInLclStg(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  getIdTvShowSelected(id: number) {
    this.idTvShowSelected = id;
  }
  getTvShowToDelete(tv: TvShow) {
    this.tvShowToDelete = tv;
  }
  toogleModalDelete(value: boolean) {
    this.isDeleteItem = value;
  }
  isDelete(event: boolean) {
    if (event) {
      console.log('Aqui endp. eliminar lista'); //-------------------------------
      // Al terminar navegar a list
      this._route.navigate(['./lists']);
    } else {
      console.log('Lista eliminada');
      this.isDeleteItem = false;
    }
  }
  onDeleteItem() {
    this.isDeleteItem = true;
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
