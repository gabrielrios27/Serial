/* Containers */
import * as authContainers from './containers/index';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './containers/login/login.component';
import { NgModule } from '@angular/core';
import { PreloginComponent } from './containers/prelogin/prelogin.component';
import { RegisterComponent } from './components/register/register.component';
import { StartAppComponent } from './containers/start-app/start-app.component';

@NgModule({
  declarations: [
    PreloginComponent,
    // LoginComponent,
    ...authContainers.containers,
    RegisterComponent,
    StartAppComponent,
  ],
  imports: [CommonModule, AuthRoutingModule, FormsModule, ReactiveFormsModule],
  exports: [...authContainers.containers],
})
export class AuthModule {}
