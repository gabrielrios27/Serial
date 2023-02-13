/* Containers */
import * as authContainers from './containers/index';

import { AuthRoutingModule } from './auth-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './containers/login/login.component';
import { NgModule } from '@angular/core';
import { PreloginComponent } from './containers/prelogin/prelogin.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [
    PreloginComponent,
    // LoginComponent,
    ...authContainers.containers,
    RegisterComponent,
  ],
  imports: [CommonModule, AuthRoutingModule, FormsModule],
  exports: [...authContainers.containers],
})
export class AuthModule {}
