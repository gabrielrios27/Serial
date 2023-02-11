import { Component, Input, OnInit } from '@angular/core';

import { TvShow } from '../../interfaces/user';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() tvShow: TvShow;
  @Input() image: any;
  scri: string = '';

  cardOpen: boolean;

  constructor() {
    this.cardOpen = false;
    this.tvShow = {} as TvShow;
  }

  ngOnInit(): void {}
  closeCard() {
    console.log('close');
    // this.cardOpen = false;
  }
  openCard() {
    console.log('open');

    // this.cardOpen = true;
  }
}
