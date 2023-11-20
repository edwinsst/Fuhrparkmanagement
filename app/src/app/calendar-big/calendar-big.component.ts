import {Component, EventEmitter, Output} from '@angular/core';


@Component({
  selector: 'app-calendar-big',
  templateUrl: './calendar-big.component.html',
  styleUrls: ['./calendar-big.component.css']
})
export class CalendarBigComponent {
  viewDate: Date = new Date();
  events = [];
}

