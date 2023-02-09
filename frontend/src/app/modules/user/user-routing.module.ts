import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './containers/home/home.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    // canActivate: [UserGuard],
    component: HomeComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
