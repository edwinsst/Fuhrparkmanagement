import { Component } from '@angular/core';
import {ToolBarComponent} from "../tool-bar/tool-bar.component";


@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css'],
  standalone: true,
  imports: [
    ToolBarComponent
  ],
})
export class AddBookingComponent {

}
