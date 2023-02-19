import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';

import { Router } from '@angular/router';
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
  clickTime: number;
  constructor(private _router: Router) {
    this.cardOpen = false;
    this.tvShow = {} as TvShow;

    this.isBack = true;
    this.clickTime = 0;

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
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.clickTime = event.timeStamp - this.clickTime;
    console.log(`Duración del clic: ${this.clickTime}ms`);
    if (this.clickTime > 300) this.toogleFlippCard();
    else this._router.navigate(['details/', this.tvShow.id]);
  }

  onMouseDown(event: MouseEvent) {
    this.clickTime = event.timeStamp;
  }
}
