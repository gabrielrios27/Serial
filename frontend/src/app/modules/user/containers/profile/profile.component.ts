import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: any;
  likedTvShows: any;

  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(private _UserSvc: UserService, private _route: Router) {}

  ngOnInit(): void {
    this.getUserLocStg();
    this.getLikedList();
  }
  getLikedList() {
    this._UserSvc
      .getLikedList()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          this.likedTvShows = data.series;
          console.log('Profile - this.likedTvShows: ', this.likedTvShows);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  getUserLocStg() {
    let userJson = localStorage.getItem('user');
    if (userJson) {
      this.user = JSON.parse(userJson);
    }
    console.log('user: ', this.user);
  }
  onCover(idTvShow: number) {
    this._route.navigate(['./details/', idTvShow]);
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
