import {Component} from "@angular/core";
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatStepperModule} from "@angular/material/stepper";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {CarsService} from "../api/services/cars.service";
import {Car} from "../api/models/car";
import {AuthenticationService, UserInfo} from "../authentication.service";
import {startOfDay} from "date-fns";
import {RidesService} from "../api/services/rides.service";
import {Ride} from "../api/models/ride";
import {ReservationsService} from "../api/services/reservations.service";
import {Reservation} from "../api/models/reservation";
import {formatDateTimeISO8601, formatDateTime, parseTime} from "../date-time-utils";
import {filterAvailableCars} from "../validation-utils";
import {MatCheckboxModule} from "@angular/material/checkbox";

@Component({
  selector: 'ride-create-dialog',
  templateUrl: 'ride-create-dialog.component.html',
  styleUrls: ['ride-create-dialog.component.css'],
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatButtonModule, MatStepperModule, ReactiveFormsModule, MatInputModule, NgIf, MatDatepickerModule, MatAutocompleteModule, NgForOf, AsyncPipe, MatListModule, MatGridListModule, MatChipsModule, MatIconModule, MatCardModule, MatCheckboxModule],
})
export class RideCreateDialogComponent {
  protected readonly separatorKeysCodes = [ENTER, COMMA] as const;
  protected readonly formatDateTime = formatDateTime;

  rideCreateStep1Form = new FormGroup({
    purpose: new FormControl('', [Validators.required]),
    startingAddress: new FormControl('', [Validators.required]),
    destinationAddress: new FormControl('', [Validators.required]),
    startDate: new FormControl(startOfDay(new Date()), [Validators.required, this.dateTimeValidator()]),
    endDate: new FormControl(startOfDay(new Date()), [Validators.required, this.dateTimeValidator()]),
    startTime: new FormControl('', [Validators.required, this.dateTimeValidator()]),
    endTime: new FormControl('', [Validators.required, this.dateTimeValidator()]),
  });

  rideCreateStep2Form = new FormGroup({
    // car: new FormControl('', [Validators.required]),
    passengers: new FormControl(null)
  });

  startingAddressOptions: Observable<string[]>;
  destinationAddressOptions: Observable<string[]>;
  addressOptions = [ 'Stuttgart', 'Karlsruhe', 'Friedrichshafen', 'München' ];

  passengers: string[] = [];
  allPassengers: string[] = [];
  passengerInfos: UserInfo[] = [];
  passengerOptions: Observable<string[]>;

  availableCars: Car[]
  selectedCar: Car | null
  cars: Car[] = []

  constructor(private dialogRef: MatDialogRef<RideCreateDialogComponent>, private carService: CarsService,
              private rideService: RidesService, private reservationService: ReservationsService,
              private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.startingAddressOptions = this.applyFilter(this.rideCreateStep1Form.controls.startingAddress);
    this.destinationAddressOptions = this.applyFilter(this.rideCreateStep1Form.controls.destinationAddress);
    this.passengerOptions = this.applyPassengerFilter(this.rideCreateStep2Form.controls.passengers);

    this.loadCars();
    this.loadUsers();
  }

  loadCars(): void {
    this.carService.listAll().subscribe({ next: cars => this.cars = cars });
  }

  getStartDate(): Date {
    return this.rideCreateStep1Form.controls.startDate.getRawValue()!;
  }

  getEndDate(): Date {
    return this.rideCreateStep1Form.controls.endDate.getRawValue()!;
  }

  getStartTime(): string {
    return this.rideCreateStep1Form.controls.startTime.getRawValue()!;
  }

  getEndTime(): string {
    return this.rideCreateStep1Form.controls.endTime.getRawValue()!;
  }

  getStartAddress(): string {
    return this.rideCreateStep1Form.controls.startingAddress.getRawValue()!;
  }

  setAvailableCars(): void {
    this.rideService.listAll_1().pipe(map(rides => filterAvailableCars(this.cars, rides, undefined,
      this.getStartDate(), this.getEndDate(), this.getStartTime(), this.getEndTime(), this.passengers.length, this.getStartAddress())))
      .subscribe(availableCars => this.availableCars = availableCars);
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({ next: userInfos => {
        this.fillPassangerArrays(userInfos);
        this.passengerInfos = userInfos;
      }});
  }

  createRideWithReservations(): void {
    const ride: Ride = {
      carId: this.selectedCar!.id!,
      startDate: formatDateTimeISO8601(this.getStartDate(), this.getStartTime()),
      endDate: formatDateTimeISO8601(this.getEndDate(), this.getEndTime()),
      startAddress: this.getStartAddress(),
      destinationAddress: this.rideCreateStep1Form.controls.destinationAddress.getRawValue()!,
      purpose: this.rideCreateStep1Form.controls.purpose.getRawValue()!
    }

    this.rideService.create_1({ body: ride }).subscribe(ride => this.createReservations(ride));
  }

  createReservations(ride: Ride): void {
    if (!ride.id) {
      return;
    }
    for (const passengerInfo of this.passengerInfos) {
      if (!this.passengers.includes(this.getFullName(passengerInfo))) {
        continue;
      }
      const reservation: Reservation = {
        userId: passengerInfo.id.toString(),
        rideId: ride.id!
      }
      this.reservationService.create_2({ body: reservation }).subscribe();
    }
    this.dialogRef.close(true);
  }

  fillPassangerArrays(userInfos: UserInfo[]): void {
    const currentUserInfo = this.authService.userInfo;
    if (currentUserInfo) {
      this.passengers = [ this.getFullName(currentUserInfo) ];
    }
    this.allPassengers = userInfos.map(userInfo => this.getFullName(userInfo));
  }

  getFullName(userInfo: UserInfo): string {
    return `${userInfo.firstName} ${userInfo.lastName}`;
  }

  applyFilter(formControl: FormControl<string | null>): Observable<string[]> {
    return formControl.valueChanges.pipe(startWith(''), map(value =>
        this.addressOptions.filter(option => option.toLowerCase().includes(value?.toLowerCase() || ''))));
  }

  applyPassengerFilter(formControl: FormControl<string | null>): Observable<string[]> {
    return formControl.valueChanges.pipe(startWith(null), map((passenger: string | null) =>
      (passenger ? this.passengerFilter(passenger) : this.allPassengers.filter(passenger => !this.passengers.includes(passenger)))));
  }

  passengerFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allPassengers.filter(passenger => !this.passengers.includes(passenger)
      && passenger.toLowerCase().includes(filterValue));
  }

  addPassenger(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && this.allPassengers.includes(value) && (this.selectedCar
      && this.passengers.length < this.selectedCar.seats)) {
      this.passengers.push(value);
      this.updateAvailableCars();
    }
    event.chipInput!.clear();
    this.rideCreateStep2Form.controls.passengers.setValue(null);
  }

  removePassenger(passenger: string) {
    const index = this.passengers.indexOf(passenger);
    if (index >= 0) {
      this.passengers.splice(index, 1);
      this.updateAvailableCars();
    }
  }

  selectedPassenger(event: MatAutocompleteSelectedEvent) {
    if (this.selectedCar && this.passengers.length >= this.selectedCar.seats) {
      return;
    }
    this.passengers.push(event.option.viewValue);
    this.updateAvailableCars();
    this.rideCreateStep2Form.controls.passengers.setValue(null);
  }

  dateTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = this.rideCreateStep1Form?.controls.startDate.getRawValue();
      const endDate = this.rideCreateStep1Form?.controls.endDate.getRawValue();

      const startTimeControl = this.rideCreateStep1Form?.controls.startTime;
      const endTimeControl = this.rideCreateStep1Form?.controls.endTime;
      if (!startTimeControl || !endTimeControl) {
        return null;
      }

      const startTime = parseTime(startTimeControl.getRawValue());
      const endTime = parseTime(endTimeControl.getRawValue());

      const isEndTimeBeforeStartTime = startTime[0] > endTime[0]
        || (startTime[0] === endTime[0] && startTime[1] > endTime[1]);

      // The end date cannot be before the start date, when they are selected with the date range picker
      // However if they are on the same date, then we need to check if the end time is before the start time
      if (startDate?.getTime() === endDate?.getTime() && isEndTimeBeforeStartTime) {
        const errors: ValidationErrors = { endBeforeStart: true };
        startTimeControl.setErrors(errors);
        endTimeControl.setErrors(errors);

        if (control == startTimeControl || control == endTimeControl) {
          return errors;
        }
        return null;
      }

      if (startTimeControl.hasError('endBeforeStart')) {
        startTimeControl.setErrors(null);
      }
      if (endTimeControl.hasError('endBeforeStart')) {
        endTimeControl.setErrors(null);
      }
      return null;
    };
  }

  updateAvailableCars(): void {
    if (!this.rideCreateStep1Form.valid) {
      return;
    }
    this.setAvailableCars();
  }
}
