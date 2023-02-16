import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-searcher',
  templateUrl: './searcher.component.html',
  styleUrls: ['./searcher.component.scss'],
})
export class SearcherComponent implements OnInit {
  toSearch: string = '';
  searchOpen: boolean;

  @Output() search = new EventEmitter<string>();
  @Output() openSearch = new EventEmitter<boolean>(false);

  constructor() {
    this.searchOpen = false;
  }

  ngOnInit(): void {}

  Search(toSearch: string) {
    this.search.emit(toSearch);
  }
  toogleSearchOpen() {
    this.searchOpen = !this.searchOpen;
    this.openSearch.emit(this.searchOpen);
  }
}
