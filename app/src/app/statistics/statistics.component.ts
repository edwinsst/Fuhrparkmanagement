import { Component } from '@angular/core';
import {ToolBarComponent} from "../tool-bar/tool-bar.component";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';

export interface PeriodicElement {
  name: string;
  position: number;
  email: string;
  kilometer: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Edwin Starz', email: 'edwinstarz@doubleslash.com', kilometer: 507},
  {position: 2, name: 'Okan Kizilagil', email: 'okankizilagil@doubleslash.com', kilometer: 457},
  {position: 3, name: 'Cedric Schaaf', email: 'cedricschaaf@doubleslash.com', kilometer: 424},
  {position: 4, name: 'Leonard Deininger', email: 'leonarddeininger@doubleslash.com', kilometer: 398},
  {position: 5, name: 'Nick Habermann', email: 'nickhabermann@doubleslash.com', kilometer: 358},
  {position: 6, name: 'Markus Rühl', email: 'markusrühl@doubleslash.com', kilometer: 316},
  {position: 7, name: 'Urs Kalecinski', email: 'urskalecinski@doubleslash.com', kilometer: 254},
  {position: 8, name: 'Ronnie Coleman', email: 'ronniecoleman@doubleslash.com', kilometer: 198},
  {position: 9, name: 'Jay Cutler', email: 'jaycutler@doubleslash.com', kilometer: 167},
  {position: 10, name: 'Chris Bumstead', email: 'chrisbumstead@doubleslash.com', kilometer: 93},
];

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  standalone: true,
  imports: [
    ToolBarComponent, MatTableModule, MatPaginatorModule
  ],

})


export class StatisticsComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'email', 'kilometer'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
