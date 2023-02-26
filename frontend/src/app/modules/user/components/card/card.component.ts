import * as Hammer from 'hammerjs';

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { Router } from '@angular/router';
import { TvShow } from './../../interfaces/user';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit, AfterViewInit {
  @Input() tvShow: TvShow;
  @Input() idTvShowSelected: number;
  @Input() idList: number;
  @Input() nameList: string;
  // @Input() isDeleteItem: boolean;
  @Output() idTvShow = new EventEmitter<number>(); //tvShowToDelete
  @Output() tvShowToDelete = new EventEmitter<TvShow>();
  @Output() clickCard = new EventEmitter<boolean>();

  isBack: boolean;

  cardOpen: boolean;
  shortOverview: string;
  clickTime: number;
  likeTv: boolean;
  saveTv: boolean;
  timeoutId: any;
  @ViewChild('myImage', { static: false }) myElementRef!: ElementRef;
  @ViewChild('myImage2', { static: false }) myElementRef2!: ElementRef;

  // suscripciones
  onDestroy$: Subject<boolean> = new Subject();
  constructor(private _router: Router, private _userSvc: UserService) {
    this.cardOpen = false;
    this.tvShow = {} as TvShow;

    this.isBack = true;
    this.clickTime = 0;

    this.shortOverview = '';
    this.idTvShowSelected = 0;
    this.likeTv = false;
    this.saveTv = false;
    this.timeoutId = 0;
    this.idList = 0;
    this.nameList = 'lista 2';
  }

  ngOnInit(): void {}
  ngAfterViewInit() {}

  toogleFlippCard() {
    console.log('toogleFlippCard');
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
    //card open se usa para que el usuario no clickee por error like o save justo cuando esta abriendo la
    if (this.cardOpen) {
      if (value === 'like') {
        if (this.likeTv) {
          console.log('Aqui endpoint de eliminar de liked');
        } else {
          console.log('Listo endpoint de guardar en favoritos');
          this.onLikeTvShow(this.tvShow);
        }
        this.likeTv = !this.likeTv;
      } else {
        if (this.saveTv) {
          console.log('Aqui endpoint de eliminar de saved');
          this.saveTv = !this.saveTv;
        } else {
          this.saveTv = !this.saveTv;
          this.saveTv
            ? this._router.navigate(['./lists/', this.tvShow.id])
            : null;
        }
      }
    }
  }
  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.clickTime = event.timeStamp - this.clickTime;
    if (this.clickTime < 200) {
      this.clickCard.emit(true);
      this._router.navigate(['./details/', this.tvShow.id]);
    } else if (!this.cardOpen) {
      this.toogleFlippCard();
      setTimeout(() => {
        this.cardOpen = true;
      }, 200);
    }
  }

  onMouseDown(event: MouseEvent) {
    this.clickTime = event.timeStamp;
  }
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    if (!this.cardOpen) {
      this.toogleFlippCard();
      setTimeout(() => {
        this.cardOpen = true;
      }, 200);
    }
  }
  onContextMenuBack(event: MouseEvent) {
    event.preventDefault();
  }

  onLikeTvShow(tv: TvShow) {
    this._userSvc
      .likeTvShow(tv)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe({
        next: (data: any) => {
          console.log('onLikeTvShow: ', data);
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
