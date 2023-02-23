import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-my-list',
  templateUrl: './my-list.component.html',
  styleUrls: ['./my-list.component.scss'],
})
export class MyListComponent implements OnInit {
  toSearch: string;
  isTypeList: boolean;

  listToShow: any;
  idTvShow: number;
  type: string;
  isTypeSaved: boolean;
  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(
    private _UserSvc: UserService,
    private _rutaActiva: ActivatedRoute
  ) {
    this.toSearch = '';

    this.isTypeList = false;
    this.idTvShow = 0;
    this.type = 'saved';
    this.isTypeSaved = true;
  }

  ngOnInit(): void {
    this.isTypeList = this.getFromLclStg('isTypeList');
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
    type === 'saved' ? (this.isTypeSaved = true) : (this.isTypeSaved = false);
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
    this.saveInLclStg('isTypeList', this.isTypeList);
  }
  saveInLclStg(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  ngOnDestroy() {
    this.onDestroy$.next(true);
  }
}
