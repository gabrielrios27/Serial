import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
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
  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(private _UserSvc: UserService) {
    this.toSearch = '';

    this.isTypeList = false;
  }

  ngOnInit(): void {
    this.isTypeList = this.getFromLclStg('isTypeList');
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
