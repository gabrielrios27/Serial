import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit {
  toSearch: string;
  btnSaved: boolean;
  isTypeList: boolean;
  user: any;
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
  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(private _UserSvc: UserService) {
    this.toSearch = '';
    this.btnSaved = true;
    this.isTypeList = false;
  }

  ngOnInit(): void {
    this.getLikedList();
    this.getSavedList();

    this.isTypeList = this.getFromLclStg('isTypeList');
    this.btnSaved = this.getFromLclStg('btnSaved');
  }
  getLikedList() {
    this._UserSvc
      .getLikedList()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          this.likedList = data.lists;
          this.likedTvShows = data.series;
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
  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
