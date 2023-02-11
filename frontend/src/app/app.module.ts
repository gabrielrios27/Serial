import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './modules/auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LayoutsModule } from './core/layouts/layouts.module';
import { NgModule } from '@angular/core';
import { UserModule } from './modules/user/user.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    UserModule,
    LayoutsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
