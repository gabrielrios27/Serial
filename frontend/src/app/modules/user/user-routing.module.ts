import { RouterModule, Routes } from '@angular/router';

import { DetailsComponent } from './containers/details/details.component';
import { HomeComponent } from './containers/home/home.component';
import { ListsComponent } from './containers/lists/lists.component';
import { MyListComponent } from './containers/my-list/my-list.component';
import { NgModule } from '@angular/core';
import { UserLayoutComponent } from 'src/app/core/layouts/containers/user-layout/user-layout.component';
import { UserModule } from './user.module';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full',
  // },
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        // canActivate: [UserGuard],
        component: HomeComponent,
        pathMatch: 'full',
      },
      {
        path: 'details/:id',
        // canActivate: [],
        component: DetailsComponent,
        pathMatch: 'full',
      },
      {
        path: 'lists',
        pathMatch: 'full',
        // canActivate: [],
        component: ListsComponent,
      },
      {
        path: 'lists/mylist/:id',
        pathMatch: 'full',
        // canActivate: [],
        component: MyListComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
