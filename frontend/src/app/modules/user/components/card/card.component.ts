import { Component, Input, OnInit } from '@angular/core';
import { Genre, TvShow } from '../../interfaces/user';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() tvShow: TvShow;
  @Input() image: any;
  isFlipped: boolean;

  cardOpen: boolean;
  shortOverview: string;

  constructor() {
    this.cardOpen = false;
    this.tvShow = {} as TvShow;
    this.isFlipped = true;
    this.shortOverview = '';
  }

  ngOnInit(): void {
    this.shortOverview = this.tvShow.overview.substr(0, 85);
  }
  toogleFlippCard() {
    this.isFlipped = !this.isFlipped;
  }
}
