import { Component } from '@angular/core';
import {ToolBarComponent} from "../tool-bar/tool-bar.component";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  imports: [
    ToolBarComponent
  ],
  standalone: true
})
export class StatisticsComponent {

}
