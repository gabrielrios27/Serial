import { CommonModule } from '@angular/common';
import { LayoutsRoutingModule } from './layouts-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserLayoutComponent } from './containers/user-layout/user-layout.component';
import { NavbarDesktopComponent } from './components/navbar-desktop/navbar-desktop.component';

@NgModule({
  declarations: [UserLayoutComponent, NavbarComponent, NavbarDesktopComponent],
  imports: [CommonModule, RouterModule, LayoutsRoutingModule],
  exports: [NavbarComponent],
})
export class LayoutsModule {}
