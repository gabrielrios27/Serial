import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { UserLog } from '../../interfaces/auth.interface';

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

  form: FormGroup;
  invalidForm: boolean;
  messageError: string;
  messageErrorEmail: string;
  notEqualPass: boolean;
  constructor(
    private router: Router,
    private _authSvc: AuthService,
    private _fb: FormBuilder
  ) {
    this.flagSeePassword = false;
    this.success = false;
    this.form = this._fb.group({
      email: [
        ,
        [
          Validators.email,
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: [
        ,
        [Validators.minLength(6), Validators.required, this.passwordValidator],
      ],
      password2: [],
    });
    this.invalidForm = false;
    this.messageError = '';
    this.messageErrorEmail = 'User already exists';
    this.notEqualPass = false;
  }

  ngOnInit(): void {}
  passwordValidator(control: FormControl) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!passwordRegex.test(control.value)) {
      return { invalidPassword: true };
    }
    return null;
  }
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

  signUpWithGoogle() {
    let googleUrl: string = this._authSvc.getGoogleOAuthURL();
    window.location.href = googleUrl;
  }
  onSubmit() {
    if (this.form.invalid) {
      this.invalidForm = true;
      return;
    }
    this.invalidForm = false;
    const { email, password, password2 } = this.form.value;
    if (this.checkPasswords(password, password2)) {
      console.log('chek true');
      this._authSvc.signUp(email, password).subscribe({
        next: (resp: UserLog) => {
          console.log('resp: ', resp);
          this.saveInLclStg('user', resp);
          this.router.navigate(['user']);
        },
        error: (error: any) => {
          this.messageError = error.error.message;
          console.log('error.error.message: ', this.messageError);
        },
      });
    } else {
      this.notEqualPass = true;
    }
  }
  checkPasswords(pass1: string, pass2: string): boolean {
    let isEqual: boolean;
    pass1 === pass2 ? (isEqual = true) : (isEqual = false);
    return isEqual;
  }

  changeInput() {
    this.messageError = '';
    this.notEqualPass = false;
  }
  saveInLclStg(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
