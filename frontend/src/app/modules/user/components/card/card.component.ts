import * as Hammer from 'hammerjs';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

import { Router } from '@angular/router';
import { TvShow } from './../../interfaces/user';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, AfterViewInit {
  @Input() tvShow: TvShow;
  @Input() idTvShowSelected: number;
  @Output() idTvShow = new EventEmitter<number>();
  isBack: boolean;

  cardOpen: boolean;
  shortOverview: string;
  clickTime: number;
  likeTv: boolean;
  saveTv: boolean;
  timeoutId: any;
  @ViewChild('myImage', { static: false }) myElementRef!: ElementRef;
  @ViewChild('myImage2', { static: false }) myElementRef2!: ElementRef;
  constructor(private _router: Router) {
    this.cardOpen = false;
    this.tvShow = {} as TvShow;

    this.isBack = true;
    this.clickTime = 0;

    this.shortOverview = '';
    this.idTvShowSelected = 0;
    this.likeTv = false;
    this.saveTv = false;
    this.timeoutId = 0;
  }

  ngOnInit(): void {}
  ngAfterViewInit() {
    if (this.myElementRef) {
      const myElement = this.myElementRef.nativeElement;
      const hammer = new Hammer(myElement);

      hammer.get('press').set({ enable: true, time: 0 });
      hammer.get('press').recognizeWith([]);
      hammer.get('press').requireFailure('pan');
      hammer.get('press').requireFailure('tap');

      hammer.on('press', (event) => {
        event.preventDefault();
        this.toogleFlippCard();
      });

      hammer.on('tap', (event) => {
        this._router.navigate(['home/details/', this.tvShow.id]);
      });

      hammer.on('pressup', (event) => {
        event.preventDefault();
      });
    }
    if (this.myElementRef) {
      const myElement = this.myElementRef.nativeElement;
      const hammer = new Hammer(myElement);

      hammer.get('press').set({ enable: true, time: 300 });
      hammer.get('press').recognizeWith([]);
      hammer.get('press').requireFailure('pan');
      hammer.get('press').requireFailure('tap');

      hammer.on('press', (event) => {
        event.preventDefault();
      });

      hammer.on('pressup', (event) => {
        event.preventDefault();
        setTimeout(() => {
          this.cardOpen = true;
        }, 500);
      });
    }
  }

  toogleFlippCard() {
    clearTimeout(this.timeoutId);
    if (this.idTvShowSelected !== this.tvShow.id) {
      this.isBack = false;
      this.cardOpen = false;
    }
    this.idTvShow.emit(this.tvShow.id);
    this.isBack = !this.isBack;

    this.timeoutId = setTimeout(() => {
      this.isBack = false;
      this.cardOpen = false;
    }, 3000);
  }
  toogleLikeOrSave(value: string) {
    if (this.cardOpen) {
      value === 'like'
        ? (this.likeTv = !this.likeTv)
        : (this.saveTv = !this.saveTv);
    }
  }
}
