import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserLog } from '../../interfaces/auth.interface';

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
  GOOGLE_CLIENT_ID: string =
    '591408333352-mj91m76m2mufk2r16a15obil0507s6dn.apps.googleusercontent.com';
  GOOGLE_REDIRECT_URL: string = 'https://serial-backend.onrender.com/user/home';
  //Datos del form
  email: string;
  password: string;

  form: FormGroup;
  invalidForm: boolean;
  messageError: string;
  messageErrorEmail: string;
  messageErrorPassword: string;
  constructor(
    private router: Router,
    private _authSvc: AuthService,
    private _fb: FormBuilder
  ) {
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
    this.email = '';
    this.password = '';
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
    });
    this.invalidForm = false;
    this.messageError = '';
    this.messageErrorEmail = "User Doesn't exist";
    this.messageErrorPassword = 'Wrong Password';
  }

  ngOnInit(): void {
    this.turnVisible();
    this.startSpotLight();
  }
  ngAfterViewInit() {
    this.togglevideoHome();
  }
  passwordValidator(control: FormControl) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (!passwordRegex.test(control.value)) {
      return { invalidPassword: true };
    }
    return null;
  }
  changeInput() {
    this.messageError = '';
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
    }, 1000);
    setTimeout(() => {
      this.restWord = true;
    }, 400);
    setTimeout(() => {
      this.endWord = true;
    }, 500);
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

  onSubmit() {
    if (this.form.invalid) {
      this.invalidForm = true;
      return;
    }
    this.invalidForm = false;
    const { email, password } = this.form.value;
    this._authSvc.logIn(email, password).subscribe({
      next: (resp: UserLog) => {
        console.log('resp: ', resp);
        this.saveInLclStg('user', resp);
        // this.success = true;
        this.router.navigate(['user']);
      },
      error: (error: any) => {
        this.messageError = error.error.message;
        console.log('error.error.message: ', this.messageError);
      },
    });
  }

  signUpWithGoogle() {
    let googleUrl: string = this._authSvc.getGoogleOAuthURL();
    window.location.href = googleUrl;
  }
  saveInLclStg(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
