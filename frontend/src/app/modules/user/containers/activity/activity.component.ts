import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit, OnDestroy {
  activitiesList: any[];

  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(
    private _UserSvc: UserService,

    private _route: Router
  ) {
    this.activitiesList = [];
  }

  ngOnInit(): void {
    this.getActivitiesList();
  }
  getActivitiesList() {
    this._UserSvc
      .getActivities()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          this.activitiesList = data;
          console.log('this.activitiesList: ', this.activitiesList);
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
