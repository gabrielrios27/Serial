import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() goPreLogin = new EventEmitter<boolean>();
  @Output() goLogin = new EventEmitter<boolean>();
  @Output() onContinue = new EventEmitter<boolean>();
  success: boolean;
  flagSeePassword: boolean;
  //Datos del form
  email: string;
  password: string;
  constructor(private router: Router, private _authSvc: AuthService) {
    this.flagSeePassword = false;
    this.success = false;
    this.email = '';
    this.password = '';
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
    this.router.navigate(['user']);
  }
  onSubmit() {
    this._authSvc.signUp(this.email, this.password).subscribe({
      next: (resp: any) => console.log('resp: ', resp),
      error: (error: any) => console.log('error', error),
    });

    // .subscribe(response => {
    //   // Handle the successful login response
    // }, error => {
    //   // Handle the error response
    // });
  }
}
