import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  images: any[] = [
    'image 22',
    'image 23',

    'image 25',
    'image 26',

    'image 29',

    'image 31',
    'image 32',
    'image 33',
    'image 34',
  ];
  constructor() {}

  ngOnInit(): void {}
}
