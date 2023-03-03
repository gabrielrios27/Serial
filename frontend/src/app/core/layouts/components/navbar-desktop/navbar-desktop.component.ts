import { Component, OnInit } from '@angular/core';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-navbar-desktop',
  templateUrl: './navbar-desktop.component.html',
  styleUrls: ['./navbar-desktop.component.scss'],
})
export class NavbarDesktopComponent implements OnInit {
  navbarOpen: boolean;
  selected: number;
  screenSelected: string;
  allTheScreens: string[];
  showText: boolean;
  constructor() {
    this.navbarOpen = true;
    this.selected = 1;
    this.showText = false;
    this.screenSelected = 'HOMEPAGE';
    this.allTheScreens = [
      '404',
      'HOMEPAGE',
      'SETTINGS',
      'LISTS',
      'ACTIVITIES',
      'PROFILE',
    ];
  }

  ngOnInit(): void {}
  onOption(value: number) {
    this.selected = value;
    this.screenSelected = this.allTheScreens[value];
  }

  toogleNavbar() {
    this.navbarOpen = !this.navbarOpen;
    if (!this.navbarOpen) {
      setTimeout(() => {
        this.showText = true;
      }, 800);
    } else {
      this.showText = false;
    }
  }
}
