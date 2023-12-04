import {HomeComponent} from "./home/home.component";
import {AddBookingComponent} from "./add-booking/add-booking.component";
import {EditComponent} from "./edit/edit.component";
import {StatisticsComponent} from "./statistics/statistics.component";

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";


const routes: Routes = [
  {
    path: '', component: LoginComponent
  },

  {
    path: 'new', component: AddBookingComponent
  },

  {
    path: 'edit', component: EditComponent
  },

  {
    path: 'statistics', component: StatisticsComponent
  },

  {
    path: 'home', component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
