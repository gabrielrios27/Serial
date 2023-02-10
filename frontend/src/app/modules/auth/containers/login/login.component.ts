import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  backVideo: boolean;
  visible: boolean;
  preLogin: boolean;
  preLoginPhrase: boolean;
  login: boolean;
  register: boolean;
  success: boolean;
  letterS: boolean;
  spotLight: boolean;
  restWord: boolean;
  endWord: boolean;
  @ViewChild('videoHome', { static: false }) videoHome!: ElementRef;

  flagSeePassword: boolean = false;
  constructor(private router: Router) {
    this.backVideo = false;
    this.visible = false;
    this.login = false;
    this.register = false;
    this.preLogin = true;
    this.preLoginPhrase = false;
    this.success = false;
    this.letterS = false;
    this.spotLight = false;
    this.restWord = false;
    this.endWord = false;
  }

  ngOnInit(): void {
    this.turnVisible();
    this.startSpotLight();
  }
  ngAfterViewInit() {
    this.togglevideoHome();
  }
  togglevideoHome() {
    this.videoHome.nativeElement.muted = true;
    this.videoHome.nativeElement.play();
  }
  startSpotLight() {
    setTimeout(() => {
      this.letterS = true;
    }, 500);

    setTimeout(() => {
      this.spotLight = true;
      setTimeout(() => {
        this.restWord = true;
        setTimeout(() => {
          this.endWord = true;
        }, 500);
      }, 400);
    }, 1000);
    setTimeout(() => {
      this.backVideo = true;
    }, 3000);
    setTimeout(() => {
      this.preLoginPhrase = true;
    }, 4000);
  }
  turnVisible() {
    setTimeout(() => {
      this.visible = true;
    }, 3000);
  }
  toogleLogin(value: string) {
    if (value === 'login') {
      this.login = true;
      this.preLogin = false;
      this.register = false;
    } else if (value === 'register') {
      this.login = false;
      this.preLogin = false;
      this.register = true;
    } else {
      this.preLogin = true;
      this.register = false;
      this.login = false;
    }
  }
  close() {
    this.login = false;
  }
  changeType() {
    let element: any = document.getElementById('password');
    if (element.type === 'text') {
      this.flagSeePassword = false;
      element.type = 'password';
    } else {
      this.flagSeePassword = true;
      element.type = 'text';
    }
  }
  toogleSuccess(value: boolean) {
    this.success = value;
    this.router.navigate(['user']);
  }
}
