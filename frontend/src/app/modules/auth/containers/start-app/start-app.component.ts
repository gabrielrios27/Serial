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

  constructor(
    private _activeRoute: ActivatedRoute,
    private _router: Router,
    private _authSvc: AuthService
  ) {}

  ngOnInit(): void {
    this.valueInRoute();
  }

  valueInRoute() {
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
              this.saveInLclStg('user', userLog);
              this._router.navigate(['user']);
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
    localStorage.setItem(key, JSON.stringify(data));
  }
}
