import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { UserLog } from './../../interfaces/auth.interface';

@Component({
  selector: 'app-start-app',
  templateUrl: './start-app.component.html',
  styleUrls: ['./start-app.component.scss'],
})
export class StartAppComponent implements OnInit {
  user: any = {};
  letterS: boolean;
  constructor(
    private _activeRoute: ActivatedRoute,
    private _router: Router,
    private _authSvc: AuthService
  ) {
    this.letterS = false;
  }

  ngOnInit(): void {
    this.letterS = true;
  }
  ngAfterViewInit() {
    this.valueInRoute();
  }

  valueInRoute() {
    console.log('valueinroute()');

    let valueRoute;
    this._activeRoute.queryParamMap.subscribe((params: ParamMap) => {
      valueRoute = params.get('code');
    });

    if (valueRoute) {
      let resp;
      this._authSvc.getGoogleOAuthTokens(valueRoute).subscribe({
        next: (data: any) => {
          resp = data;
          const { id_token, access_token } = resp;
          const url = `https://serial-backend.onrender.com/user/signin/oauth/${id_token}`;
          this._authSvc.getAuthFromDb(url).subscribe({
            next: (userLog: UserLog) => {
              console.log('userLog: ', userLog);

              this._router.navigate(['user']);
              this.saveInLclStg('user', userLog);
            },
            error: (error: any) => {
              console.log('error22: ', error);
            },
          });
        },
        error: (err) => {
          console.log('error11: ', err);
        },
      });
    } else {
      this._router.navigate(['auth']);
    }
  }
  saveInLclStg(key: string, data: any) {
    console.log('saveInLclStg()');

    localStorage.setItem(key, JSON.stringify(data));
  }
}
