import {HomeComponent} from "./home/home.component";
import {AddBookingComponent} from "./add-booking/add-booking.component";
import {EditComponent} from "./edit/edit.component";
import {StatisticsComponent} from "./statistics/statistics.component";

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '', component: HomeComponent
  },

  {
    path: 'new', component: AddBookingComponent
  },

  {
    path: 'edit', component: EditComponent
  },

  {
    path: 'statistics', component: StatisticsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
