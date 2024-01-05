import {Component} from "@angular/core";
import {MatStepperModule} from "@angular/material/stepper";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {forkJoin, Observable, of} from "rxjs";

import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";

import {RidesService} from "../api/services/rides.service";
import {ReservationsService} from "../api/services/reservations.service";
import {Ride} from "../api/models/ride";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.component.html',
  styleUrl: 'delete-dialog.component.css',
  standalone: true,
  imports: [MatFormFieldModule, MatStepperModule, ReactiveFormsModule, MatInputModule, NgIf, MatDatepickerModule, MatAutocompleteModule, NgForOf, AsyncPipe, MatChipsModule, MatIconModule, MatListModule, MatDialogModule, MatButtonModule],
})
export class DeleteDialogComponent {

  ride: Ride;

  constructor(private dialogRef: MatDialogRef<DeleteDialogComponent>,
              private rideService: RidesService, private reservationService: ReservationsService) {

  }

  deleteRideWithReservation(): void {
    const deleteObservables: Observable<void>[] = [];
    this.reservationService.listAll_2().subscribe(reservations => {
      for (const reservation of reservations) {
        if (reservation.rideId === this.ride.id) {
          deleteObservables.push(this.reservationService.delete_2({id: reservation.id!}));
        }
      }
      (deleteObservables.length ? forkJoin(deleteObservables) : of([]))
        .subscribe(() => {
          this.rideService.delete_1({id: this.ride.id!})
            .subscribe(() => this.dialogRef.close(true));
        });
    });
  }
}
