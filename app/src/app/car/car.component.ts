import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {NgIf} from "@angular/common";
import {ToolBarComponent} from "../tool-bar/tool-bar.component";
import {Car} from "../api/models/car";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {CarsService} from "../api/services/cars.service";
import {MatDateRangeInput} from "@angular/material/datepicker";
import {Ride} from "../api/models/ride";
import {Title} from "@angular/platform-browser";
import {APP_NAME} from "../app.component";
import {MatIconModule} from "@angular/material/icon";
import {EditCarComponent} from "../edit-car/edit-car.component";

@Component({

  selector: 'app-car',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    NgIf,
    ReactiveFormsModule,
    ToolBarComponent,
    MatIconModule
  ],
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent {
  @ViewChild('dateRangePicker')
  dateRangePicker: MatDateRangeInput<any>

  displayedCarColumns: string[] = ['licensePlate', 'modelName', 'fuelType', 'location', 'seats',
    'range', 'available', 'actions'];
  loadedCars: Car[] = [];

  displayedRideColumns: string[] = ['id', 'purpose', 'startAddress', 'destinationAddress', 'startDate', 'endDate',
    'carId'];
  loadedRides: Ride[] = [];

  carCreateForm = new FormGroup({
    licensePlate: new FormControl('', [Validators.required]),
    modelName: new FormControl('', [Validators.required]),
    fuelType: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    seats: new FormControl('', [Validators.required, Validators.min(1)]),
    range: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  constructor(private carService: CarsService, public dialog: MatDialog, private titleService: Title) {
    titleService.setTitle("Autos | " + APP_NAME)
  }

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.listAll().subscribe({ next: cars => this.loadedCars = cars });
  }

  createCar(car: Car): void {
    this.carService.create({ body: car })
      .subscribe({ next: car => this.loadedCars = [ ...this.loadedCars, car ] });
  }

  openCarCreateDialog(): void {
    const dialogRef = this.dialog.open(ConfirmCarCreateDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      const licensePlate = this.carCreateForm.controls.licensePlate.getRawValue() || '';
      const modelName = this.carCreateForm.controls.modelName.getRawValue() || '';
      const fuelType = this.carCreateForm.controls.fuelType.getRawValue() || '';
      const location = this.carCreateForm.controls.location.getRawValue() || '';
      const seats = parseInt(this.carCreateForm.controls.seats.getRawValue() || '');
      const range = parseInt(this.carCreateForm.controls.range.getRawValue() || '');

      const car: Car = {
        licensePlate,
        modelName,
        fuelType,
        location,
        seats,
        range
      };
      this.createCar(car);
    });
  }

  translateFuelType(car: Car): string {
    let result = '';
    switch (car.fuelType) {
      case 'PETROL':
        result = 'Benzin';
        break;
      case 'DIESEL':
        result = 'Diesel';
        break;
      case 'ELECTRIC':
        result = 'Elektrisch';
        break;
    }
    return result;
  }

  editCarClicked(car: Car): void {
    const dialogRef = this.dialog.open(EditCarComponent);
    dialogRef.componentInstance.car = car;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCars();
      }
    });
  }

  deleteCarClicked(car: Car): void {
    const dialogRef = this.dialog.open(ConfirmCarDeleteDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carService.delete({ id: car.id! }).subscribe({ next: () => this.loadCars() });
      }
    });
  }
}

@Component({
  selector: 'confirm-car-create-dialog',
  templateUrl: 'confirm-car-create-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmCarCreateDialog {}

@Component({
  selector: 'confirm-car-delete-dialog',
  templateUrl: 'confirm-car-delete-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmCarDeleteDialog {}
