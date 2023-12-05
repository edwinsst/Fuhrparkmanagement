import {Component} from '@angular/core';
import {
  CalendarCommonModule,
  CalendarEvent,
  CalendarMonthModule,
  CalendarView,
  CalendarWeekModule
} from "angular-calendar";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours, startOfMonth,
} from 'date-fns';
import {MatDialog} from "@angular/material/dialog";
import {ConfirmContentDialog} from "../add-booking/add-booking.component";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-calendar-big',
  templateUrl: './calendar-big.component.html',
  styleUrls: ['./calendar-big.component.css'],
  imports: [
    CalendarMonthModule,
    CalendarCommonModule,
    CommonModule,
    CalendarWeekModule,
    MatButtonModule
  ],
  standalone: true
})
export class CalendarBigComponent {
  view: CalendarView = CalendarView.Month;
  EVENT_LIMIT = 5;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    {
      start: subDays(startOfMonth(new Date()), 3),
      end: new Date(),
      title: 'Firmenausflug',
      color: { primary: '#ad2121', secondary: '#FAE3E3' },
      allDay: true,
    }
  ];

  constructor(public dialog: MatDialog) {
  }

  eventClicked(event: CalendarEvent) {
    this.dialog.open(ConfirmContentDialog);
  }

  dayClicked(date: Date) {
    //this.dialog.open(ConfirmContentDialog);
  }

  handleMoreEvent(e: any , events: any[]) {

  }

  protected readonly CalendarView = CalendarView;
}

