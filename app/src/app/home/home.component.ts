import { Component } from '@angular/core';
import {ToolBarComponent} from "../tool-bar/tool-bar.component";
import {CalendarBigComponent} from "../calendar-big/calendar-big.component";
import {EventsComponent} from "../events/events.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    ToolBarComponent,
    CalendarBigComponent,
    EventsComponent
  ],
  standalone: true
})
export class HomeComponent {

}
