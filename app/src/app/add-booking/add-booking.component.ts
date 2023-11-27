import { Component } from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-demo',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css'],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgIf,
    MatDialogModule
  ],
  standalone: true
})
export class AddBookingComponent {
  displayedColumns: string[] = ['id', 'licensePlate', 'modelName', 'fuelType', 'location', 'seats', 'range', 'available'];
  loadedCars: Car[] = [];

  carCreateForm = new FormGroup({
    licensePlate: new FormControl('', [Validators.required]),
    modelName: new FormControl('', [Validators.required]),
    fuelType: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    seats: new FormControl('', [Validators.required, Validators.min(1)]),
    range: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.getCars();
  }

  getCars(): void {
    this.http.get<Car[]>('http://localhost:8080/cars/list').subscribe(data => this.loadedCars = data);
  }

  createCar(car: Car): void {
    let { _, ...carWithoutId }: any = car;
    this.http.post('http://localhost:8080/cars/create', carWithoutId).subscribe(data => console.log(data));
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmContentDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const licensePlate = this.carCreateForm.controls.licensePlate.getRawValue() || "";
        const modelName = this.carCreateForm.controls.modelName.getRawValue() || "";
        const fuelType = parseInt(this.carCreateForm.controls.fuelType.getRawValue() || "");
        const location = this.carCreateForm.controls.location.getRawValue() || "";
        const seats = parseInt(this.carCreateForm.controls.seats.getRawValue() || "");
        const range = parseInt(this.carCreateForm.controls.range.getRawValue() || "");

        this.createCar(new Car(0, licensePlate, modelName, fuelType, location, seats, range));
      }
    });
  }
}

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmContentDialog {}

export enum FuelType {
  Petrol,
  Diesel,
  Electric
}

export class Car {
  id: number;
  licensePlate: string;
  modelName: string;
  fuelType: FuelType;
  location: string;
  seats: number;
  range: number;
  available: boolean;

  constructor(id: number, licensePlate: string, modelName: string, fuelType: FuelType, location: string,
              seats: number, range: number, available: boolean = true)
  {
    this.id = id;
    this.licensePlate = licensePlate;
    this.modelName = modelName;
    this.fuelType = fuelType;
    this.location = location;
    this.seats = seats;
    this.range = range;
    this.available = available;
  }
}
