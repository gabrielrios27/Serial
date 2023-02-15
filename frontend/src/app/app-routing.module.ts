import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';
import { StartAppComponent } from './modules/auth/containers/start-app/start-app.component';
import { UserLayoutComponent } from './core/layouts/containers/user-layout/user-layout.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: StartAppComponent,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth-routing.module').then(
        (m) => m.AuthRoutingModule
      ),
  },
  {
    path: 'user',

    component: UserLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./modules/user/user-routing.module').then(
            (m) => m.UserRoutingModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
