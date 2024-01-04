import { Component } from '@angular/core';
import {ToolBarComponent} from "../tool-bar/tool-bar.component";
import {MatTableModule} from '@angular/material/table';
import {Title} from "@angular/platform-browser";
import {APP_NAME} from "../app.component"

export interface PeriodicElement {
  name: string;
  position: number;
  kilometer: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', kilometer: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', kilometer: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', kilometer: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', kilometer: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', kilometer: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', kilometer: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', kilometer: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', kilometer: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', kilometer: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', kilometer: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  standalone: true,
  imports: [
    ToolBarComponent, MatTableModule
  ],

})


export class StatisticsComponent {
  displayedColumns: string[] = ['position', 'name', 'kilometer', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor(
    private titleService: Title

  ) {
    titleService.setTitle("Statistik | " + APP_NAME);
  }
}
