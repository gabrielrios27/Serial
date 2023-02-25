import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TvShow } from './../../interfaces/user';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.scss'],
})
export class ModalDeleteComponent implements OnInit {
  @Input() tvShow: TvShow;
  @Input() listId: number;
  @Input() listName: string;
  @Input() isTvShow: boolean;

  @Output() isDeleteItem = new EventEmitter<boolean>();
  constructor() {
    this.tvShow = {} as TvShow;
    this.listId = 0;
    this.listName = '';
    this.isTvShow = true;
  }

  ngOnInit(): void {
    this.tvShow.id ? (this.isTvShow = true) : (this.isTvShow = false);
  }

  onYesOrNo(value: boolean) {
    if (value) {
      this.isDeleteItem.emit(true);
    } else {
      this.isDeleteItem.emit(false);
    }
  }
}
