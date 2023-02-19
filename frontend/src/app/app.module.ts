import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import {
  HashLocationStrategy,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './modules/auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LayoutsModule } from './core/layouts/layouts.module';
import { UserModule } from './modules/user/user.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    UserModule,
    LayoutsModule,
    FormsModule,
    InfiniteScrollModule,
    BrowserAnimationsModule,
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
