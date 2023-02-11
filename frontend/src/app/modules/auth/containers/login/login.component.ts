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
  visible: boolean;
  preLogin: boolean;
  login: boolean;
  register: boolean;
  success: boolean;
  @ViewChild('videoHome', { static: false }) videoHome!: ElementRef;

  flagSeePassword: boolean = false;
  constructor(private router: Router) {
    this.visible = false;
    this.login = false;
    this.register = false;
    this.preLogin = true;
    this.success = false;
  }

  ngOnInit(): void {
    this.turnVisible();
  }
  ngAfterViewInit() {
    this.togglevideoHome();
  }
  togglevideoHome() {
    this.videoHome.nativeElement.muted = true;
    this.videoHome.nativeElement.play();
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
