import { Component } from '@angular/core';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {NgIf} from "@angular/common";
import {Car} from "../api/models/car";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {CarsService} from "../api/services/cars.service";

@Component({
  selector: 'app-edit-car',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    NgIf,
    MatCheckboxModule
  ],
  templateUrl: './edit-car.component.html',
  styleUrl: './edit-car.component.css'
})
export class EditCarComponent {

  car: Car;

  editCarForm = new FormGroup({
    licensePlate: new FormControl('', [Validators.required]),
    modelName: new FormControl('', [Validators.required]),
    fuelType: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    seats: new FormControl(1, [Validators.required, Validators.min(1)]),
    range: new FormControl(1, [Validators.required, Validators.min(1)]),
    available: new FormControl(false)
  });

  constructor(private dialogRef: MatDialogRef<EditCarComponent>, private carService: CarsService) {
  }

  ngOnInit(): void {
    this.fillFormFields();
  }

  fillFormFields(): void {
    this.editCarForm.controls.licensePlate.setValue(this.car.licensePlate);
    this.editCarForm.controls.modelName.setValue(this.car.modelName);
    this.editCarForm.controls.fuelType.setValue(this.car.fuelType);
    this.editCarForm.controls.location.setValue(this.car.location);
    this.editCarForm.controls.seats.setValue(this.car.seats);
    this.editCarForm.controls.range.setValue(this.car.range);
    this.editCarForm.controls.available.setValue(this.car.available || false);
  }

  updateCar(): void {
    const updatedCar: Car = {
      licensePlate: this.editCarForm.controls.licensePlate.getRawValue()!,
      modelName: this.editCarForm.controls.modelName.getRawValue()!,
      fuelType: this.editCarForm.controls.fuelType.getRawValue()!,
      location: this.editCarForm.controls.location.getRawValue()!,
      seats: this.editCarForm.controls.seats.getRawValue()!,
      range: this.editCarForm.controls.range.getRawValue()!,
      available: this.editCarForm.controls.available.getRawValue()!
    };
    this.carService.update({ id: this.car.id!, body: updatedCar })
      .subscribe({ next: () => this.dialogRef.close(true) });
  }
}
