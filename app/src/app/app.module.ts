import { AppComponent } from './app.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { EventsComponent } from './events/events.component';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from "./app-routing.module";

import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {RouterOutlet} from "@angular/router";

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { CalendarComponent } from "./calendar/calendar.component";
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarBigComponent } from './calendar-big/calendar-big.component';

import { MaterialModule } from "./material/material.module";
import { EditComponent } from './edit/edit.component';
import { StatisticsComponent } from './statistics/statistics.component';
import {LoginComponent} from "./login/login.component";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    MaterialModule,
    CalendarComponent,
    ToolBarComponent,
    HomeComponent,
    CalendarBigComponent,
    BrowserAnimationsModule,
    EventsComponent,
    AddBookingComponent,
    EditComponent,
    StatisticsComponent,
    LoginComponent,
    HttpClientModule,
    AppRoutingModule,
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory}),
    RouterOutlet
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule { }
