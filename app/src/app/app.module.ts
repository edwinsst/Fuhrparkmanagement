import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CalendarComponent } from "./calendar/calendar.component";
import { MaterialModule } from "./material/material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarBigComponent } from './calendar-big/calendar-big.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { EventsComponent } from './events/events.component';




@NgModule({
  declarations: [
    AppComponent,
    CalendarBigComponent,
  ],
  imports: [
    MaterialModule,
    CalendarComponent,
    ToolBarComponent,
    BrowserAnimationsModule,
    EventsComponent,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [CalendarBigComponent],
})
export class AppModule { }
