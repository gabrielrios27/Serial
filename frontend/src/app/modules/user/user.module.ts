import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CardComponent } from './components/card/card.component';
import { CommonModule } from '@angular/common';
import { DetailsComponent } from './containers/details/details.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './containers/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { SearcherComponent } from './components/searcher/searcher.component';
import { UserRoutingModule } from './user-routing.module';
import { ListsComponent } from './containers/lists/lists.component';
import { MyListComponent } from './containers/my-list/my-list.component';

@NgModule({
  declarations: [
    HomeComponent,
    SearcherComponent,
    CardComponent,
    DetailsComponent,
    ListsComponent,
    MyListComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    MatExpansionModule,
    MatSelectModule,
  ],
  exports: [SearcherComponent, CardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UserModule {}
