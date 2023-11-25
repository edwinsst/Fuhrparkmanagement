import { Component } from '@angular/core';
import {ToolBarComponent} from "../tool-bar/tool-bar.component";
import {EventsComponent} from "../events/events.component";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  imports: [
    ToolBarComponent,
    EventsComponent
  ],
  standalone: true
})
export class EditComponent {

}
