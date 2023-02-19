import { RouterModule, Routes } from '@angular/router';

import { DetailsComponent } from './containers/details/details.component';
import { HomeComponent } from './containers/home/home.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    // canActivate: [UserGuard],
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
