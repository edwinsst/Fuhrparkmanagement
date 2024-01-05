import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ToolBarComponent} from "../tool-bar/tool-bar.component";
import { CalendarBigComponent } from "../calendar-big/calendar-big.component";
import {EventsComponent} from "../events/events.component";
import {Title} from "@angular/platform-browser";
import {APP_NAME} from "../app.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    ToolBarComponent,
    CalendarBigComponent,
    EventsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class HomeComponent {
  constructor(
    private titleService: Title

) {
    titleService.setTitle("Kalender | " + APP_NAME);
}
}
