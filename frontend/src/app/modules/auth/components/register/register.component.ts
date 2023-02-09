import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() goPreLogin = new EventEmitter<boolean>();
  @Output() goLogin = new EventEmitter<boolean>();
  success: boolean;
  flagSeePassword: boolean;
  constructor() {
    this.flagSeePassword = false;
    this.success = false;
  }

  ngOnInit(): void {}

  toogleLogin(value: string) {
    if (value === 'login') {
      this.goLogin.emit(true);
    } else if (value === 'preLogin') {
      this.goPreLogin.emit(true);
    }
  }
  changeType() {
    let element: any = document.getElementById('password');
    let element2: any = document.getElementById('password2');
    if (element.type === 'text' && element2.type === 'text') {
      this.flagSeePassword = false;
      element.type = 'password';
      element2.type = 'password';
    } else {
      this.flagSeePassword = true;
      element.type = 'text';
      element2.type = 'text';
    }
  }
  toogleSuccess(value: boolean) {
    this.success = value;
  }
}
