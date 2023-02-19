import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CardComponent } from './components/card/card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './containers/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';
import { SearcherComponent } from './components/searcher/searcher.component';
import { UserRoutingModule } from './user-routing.module';
import { DetailsComponent } from './containers/details/details.component';

@NgModule({
  declarations: [HomeComponent, SearcherComponent, CardComponent, DetailsComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    InfiniteScrollModule,
  ],
  exports: [SearcherComponent, CardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule {}
