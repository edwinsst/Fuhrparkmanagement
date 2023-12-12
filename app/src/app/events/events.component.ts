import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from "@angular/material/button";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {EditDialogComponent} from "../edit-dialog/edit-dialog.component";

export interface PeriodicElement {
  name: string;
  position: number;
  licensePlate: string;
  time: string;
  car: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Cedric', car: 'Smart', licensePlate: 'GP-DS-0001', time: '02.03.2024 (12:00) - 04.03.2024 (17:00)'},
  {position: 2, name: 'Leonard', car: 'Lamborghini', licensePlate: 'GP-DS-0002', time: '04.04.2024 (14:00) - 07.04.2024 (19:00)'},
  {position: 3, name: 'Edwin', car: 'VW Polo', licensePlate: 'GP-DS-0003', time: '12.05.2024 (08:00) - 16.05.2024 (18:00)'},
  {position: 4, name: 'Okan', car: 'BMW M4', licensePlate: 'GP-DS-0004', time: '20.06.2024 (16:00) - 23.06.2024 (22:00)'},
  {position: 5, name: 'Nick', car: 'Mercedes-Benz 560 SEC', licensePlate: 'GP-DS-0005', time: '16.07.2024 (15:00) - 19.07.2024 (14:00)'},
];

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDividerModule, MatIconModule, MatButtonModule, MatDialogModule]
})
export class EventsComponent {
  displayedColumns: string[] = ['position', 'name', 'car', 'licensePlate', 'time', 'actions'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) {}

  editBooking() {
    const dialogRef = this.dialog.open(EditDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteBooking() {
    const dialogRef = this.dialog.open(DialogDelete);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'dialog-edit',
  templateUrl: 'dialog-edit.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogEdit {}

@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogDelete {}


