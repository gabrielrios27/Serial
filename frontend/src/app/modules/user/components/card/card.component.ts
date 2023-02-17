import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TvShow } from '../../interfaces/user';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() tvShow: TvShow;
  @Input() idTvShowSelected: number;
  @Output() idTvShow = new EventEmitter<number>();
  isBack: boolean;

  cardOpen: boolean;
  shortOverview: string;

  constructor() {
    this.cardOpen = false;
    this.tvShow = {} as TvShow;
    this.isBack = false;
    this.shortOverview = '';
    this.idTvShowSelected = 0;
  }

  ngOnInit(): void {}
  toogleFlippCard() {
    if (this.idTvShowSelected !== this.tvShow.id) {
      this.isBack = false;
    }
    this.idTvShow.emit(this.tvShow.id);
    this.isBack = !this.isBack;
  }
}
