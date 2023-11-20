import { Component } from '@angular/core';
import {ToolBarComponent} from "../tool-bar/tool-bar.component";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  imports: [
    ToolBarComponent
  ],
  standalone: true
})
export class EditComponent {

}
