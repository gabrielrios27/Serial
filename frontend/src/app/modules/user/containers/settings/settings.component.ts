import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  terms: boolean;
  policity: boolean;
  constructor(private _route: Router) {
    this.terms = false;
    this.policity = false;
  }
  logOut() {
    localStorage.clear();
    this._route.navigate(['auth']);
  }

  toogleModaltermsOfUse() {
    this.terms = !this.terms;
  }
  toogleModalPolicity() {
    this.policity = !this.policity;
  }
}
