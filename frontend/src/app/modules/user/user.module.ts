import { CardComponent } from './components/card/card.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './containers/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearcherComponent } from './components/searcher/searcher.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [HomeComponent, SearcherComponent, CardComponent],
  imports: [CommonModule, UserRoutingModule, RouterModule, FormsModule],
  exports: [SearcherComponent, CardComponent],
})
export class UserModule {}
