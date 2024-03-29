import {HomeComponent} from "./home/home.component";
import {AddBookingComponent} from "./add-booking/add-booking.component";
import {EditComponent} from "./edit/edit.component";
import {StatisticsComponent} from "./statistics/statistics.component";

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {loginGuard} from "./login.guard";
import {CarComponent} from "./car/car.component";

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },

  {
    path: 'new', component: AddBookingComponent, canActivate: [ loginGuard ]
  },

  {
    path: 'edit', component: EditComponent, canActivate: [ loginGuard ]
  },

  {
    path: 'statistics', component: StatisticsComponent, canActivate: [ loginGuard ]
  },

  {
    path: 'home', component: HomeComponent, canActivate: [ loginGuard ]
  },

  {
    path: 'cars', component: CarComponent, canActivate: [ loginGuard ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
