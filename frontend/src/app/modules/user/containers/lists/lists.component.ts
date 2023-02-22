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
  listToShow: any;
  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(private _UserSvc: UserService) {
    this.toSearch = '';
    this.btnSaved = true;
    this.isTypeList = false;
  }

  ngOnInit(): void {
    this.getLikedList();
  }
  getLikedList() {
    this._UserSvc
      .getLikedList()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          this.likedList = data;
          console.log('this.likedList: ', this.likedList);
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
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getUserToken() {
    let tokenJSON = localStorage.getItem('user');

    if (tokenJSON) {
      this.user = JSON.parse(tokenJSON);
      console.log('token: ', this.user);
    }
  }
  Search(toSearch: string) {
    console.log(toSearch);
  }
  toogleLikedOrSaved(value: boolean) {
    this.btnSaved = value;
    if (value) {
      this.listToShow = this.savedList;
    } else {
      this.listToShow = this.likedList;
    }
  }
  toogleType() {
    this.isTypeList = !this.isTypeList;
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
