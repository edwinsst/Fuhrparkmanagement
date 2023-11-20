import {Component} from '@angular/core';
import {CalendarMonthModule} from "angular-calendar";


@Component({
  selector: 'app-calendar-big',
  templateUrl: './calendar-big.component.html',
  styleUrls: ['./calendar-big.component.css'],
  imports: [
    CalendarMonthModule
  ],
  standalone: true
})
export class CalendarBigComponent {
  viewDate: Date = new Date();
  events = [];
}

