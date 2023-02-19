import { RouterModule, Routes } from '@angular/router';

import { DetailsComponent } from './containers/details/details.component';
import { HomeComponent } from './containers/home/home.component';
import { NgModule } from '@angular/core';
import { UserLayoutComponent } from 'src/app/core/layouts/containers/user-layout/user-layout.component';
import { UserModule } from './user.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: UserLayoutComponent,
    children: [
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
