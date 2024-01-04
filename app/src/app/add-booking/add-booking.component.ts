import {Component, ViewChild} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ToolBarComponent} from "../tool-bar/tool-bar.component";
import {MatDatepickerModule, MatDateRangeInput} from "@angular/material/datepicker";
import {CarsService, ReservationsService, RidesService} from "../api/services";
import {Car} from "../api/models/car";
import {Ride} from "../api/models/ride";
import {Reservation} from "../api/models/reservation";
import {Title} from "@angular/platform-browser";
import {APP_NAME} from "../app.component";

const DATE_REGEX = /(?<month>[A-Z][a-z]{2}) (?<day>[0-9]{2}) (?<year>[0-9]{4})/
const TIME_REGEX = /(?<hour>[0-9]{2}):(?<minute>[0-9]{2})/

@Component({
  selector: 'app-add-booking',
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
    MatDialogModule,
    ToolBarComponent,
    MatDatepickerModule,
    NgForOf
  ],
  standalone: true
})
export class AddBookingComponent {
  @ViewChild('dateRangePicker')
  dateRangePicker:  MatDateRangeInput<any>

  loadedCars: Car[] = [];

  displayedRideColumns: string[] = ['id', 'purpose', 'startAddress', 'destinationAddress', 'startDate', 'endDate',
    'carId'];
  loadedRides: Ride[] = [];

  rideCreateForm = new FormGroup({
    purpose: new FormControl('', [Validators.required]),
    startingAddress: new FormControl('', [Validators.required]),
    destinationAddress: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    car: new FormControl('', [Validators.required]),
  });

  constructor(private carService: CarsService, private rideService: RidesService,
              private reservationService: ReservationsService, public dialog: MatDialog, private titleService: Title) {
    titleService.setTitle("Neue Buchung | " + APP_NAME)
  }

  ngOnInit(): void {
    this.loadCars();
    this.loadRides();
  }

  loadCars(): void {
    this.carService.listAll().subscribe({ next: cars => this.loadedCars = cars });
  }

  loadRides(): void {
    this.rideService.listAll_1().subscribe({ next: rides => this.loadedRides = rides });
  }

  createRide(ride: Ride): void {
    this.rideService.create_1({ body: ride })
      .subscribe({ next: ride => {
        this.loadedRides = [ ...this.loadedRides, ride ];
        if (!ride.id) {
          return;
        }
        this.createReservation({
          userId: '1', // TODO: change
          rideId: ride.id
        });
      }});
  }

  createReservation(reservation: Reservation) {
    this.reservationService.create_2({ body: reservation })
      .subscribe(reservation => console.log(reservation));
  }

  getMonth(month: string): string {
    switch (month) {
      case "Jan":
        return '01';
      case "Feb":
        return '02';
      case "Mar":
        return '03';
      case "Apr":
        return '04';
      case "May":
        return '05';
      case "Jun":
        return '06';
      case "Jul":
        return '07';
      case "Aug":
        return '08';
      case "Sep":
        return '09';
      case "Oct":
        return '10';
      case "Nov":
        return '11';
      case "Dec":
        return '12';
    }
    return '00';
  }

  formatDateTime(date: string, time: string): string {
    const dateRegexMatch = String(String(date).substring(4, 15)).match(DATE_REGEX);
    const timeRegexMatch = String(time).match(TIME_REGEX);

    if (dateRegexMatch?.groups && timeRegexMatch?.groups) {
      const year = dateRegexMatch.groups['year'];
      const month = this.getMonth(dateRegexMatch.groups['month']);
      const day = dateRegexMatch.groups['day'];
      const hour = timeRegexMatch.groups['hour'];
      const minute = timeRegexMatch.groups['minute'];
      return `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
    }
    return '';
  }

  openRideCreateDialog(): void {
    const dialogRef = this.dialog.open(ConfirmRideCreateDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      const purpose = this.rideCreateForm.controls.purpose.getRawValue() || '';
      const startAddress = this.rideCreateForm.controls.startingAddress.getRawValue() || '';
      const destinationAddress = this.rideCreateForm.controls.destinationAddress.getRawValue() || '';
      const startDate = this.rideCreateForm.controls.startDate.getRawValue() || '';
      const endDate = this.rideCreateForm.controls.endDate.getRawValue() || '';
      const startTime = this.rideCreateForm.controls.startTime.getRawValue() || '';
      const endTime = this.rideCreateForm.controls.endTime.getRawValue() || '';
      const carId = parseInt(this.rideCreateForm.controls.car.getRawValue() || '');

      const formattedStartDateTime = this.formatDateTime(startDate, startTime);
      const formattedEndDateTime = this.formatDateTime(endDate, endTime);

      const ride: Ride = {
        purpose,
        startAddress,
        destinationAddress,
        startDate: formattedStartDateTime,
        endDate: formattedEndDateTime,
        carId
      };
      this.createRide(ride);
    });
  }
}

@Component({
  selector: 'confirm-ride-create-dialog',
  templateUrl: 'confirm-ride-create-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmRideCreateDialog {}
