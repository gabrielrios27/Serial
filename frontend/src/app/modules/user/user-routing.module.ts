import { RouterModule, Routes } from '@angular/router';

import { ActivityComponent } from './containers/activity/activity.component';
import { DetailsComponent } from './containers/details/details.component';
import { HomeComponent } from './containers/home/home.component';
import { ListsComponent } from './containers/lists/lists.component';
import { MyListComponent } from './containers/my-list/my-list.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './containers/profile/profile.component';
import { SettingsComponent } from './containers/settings/settings.component';
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
        path: 'lists/:id',
        pathMatch: 'full',
        // canActivate: [],
        component: ListsComponent,
      },
      {
        path: 'lists/mylist/:type/:id',
        pathMatch: 'full',
        // canActivate: [],
        component: MyListComponent,
      },
      {
        path: 'lists/:idSaved/mylist/:type/:id',
        pathMatch: 'full',
        // canActivate: [],
        component: MyListComponent,
      },
      {
        path: 'settings',
        pathMatch: 'full',
        // canActivate: [],
        component: SettingsComponent,
      },
      {
        path: 'activities',
        pathMatch: 'full',
        // canActivate: [],
        component: ActivityComponent,
      },
      {
        path: 'profile',
        pathMatch: 'full',
        // canActivate: [],
        component: ProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
