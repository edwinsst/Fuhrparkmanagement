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
import {forkJoin, Observable, of, startWith} from "rxjs";
import {filter, map} from "rxjs/operators";
import {MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {startOfDay} from "date-fns";
import {formatDateTimeISO8601, parseTime, toTimeString} from "../date-time-utils";
import {AuthenticationService, UserInfo} from "../authentication.service";
import {Car} from "../api/models/car";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {filterAvailableCars} from "../validation-utils";
import {CarsService} from "../api/services/cars.service";
import {RidesService} from "../api/services/rides.service";
import {ReservationsService} from "../api/services/reservations.service";
import {Ride} from "../api/models/ride";
import {Reservation} from "../api/models/reservation";

@Component({
  selector: 'edit-dialog',
  templateUrl: 'edit-dialog.component.html',
  styleUrl: 'edit-dialog.component.css',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatButtonModule, MatStepperModule, ReactiveFormsModule, MatInputModule, NgIf, MatDatepickerModule, MatAutocompleteModule, NgForOf, AsyncPipe, MatChipsModule, MatIconModule, MatListModule],
})
export class EditDialogComponent {
  protected readonly separatorKeysCodes = [ENTER, COMMA] as const;

  ride: Ride;
  rides: Ride[] = [];

  rideCreateForm = new FormGroup({
    purpose: new FormControl('', [Validators.required]),
    startingAddress: new FormControl('', [Validators.required]),
    destinationAddress: new FormControl('', [Validators.required]),
    startDate: new FormControl(startOfDay(new Date()), [Validators.required, this.dateTimeValidator()]),
    endDate: new FormControl(startOfDay(new Date()), [Validators.required, this.dateTimeValidator()]),
    startTime: new FormControl('', [Validators.required, this.dateTimeValidator()]),
    endTime: new FormControl('', [Validators.required, this.dateTimeValidator()]),
    passengers: new FormControl(null)
  });

  startingAddressOptions: Observable<string[]>;
  destinationAddressOptions: Observable<string[]>;
  addressOptions = [ 'Stuttgart Feuerbach', 'Karlsruhe', 'Friedrichshafen' ];

  passengers: UserInfo[] = [];
  allPassengers: string[] = [];
  passengerInfos: UserInfo[] = [];
  passengerOptions: Observable<string[]>;
  loadedCurrentPassengers = false;

  availableCars: Car[]
  selectedCar: Car | null
  cars: Car[] = []

  constructor(private dialogRef: MatDialogRef<EditDialogComponent>, private carService: CarsService,
              private rideService: RidesService, private reservationService: ReservationsService,
              private authService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.startingAddressOptions = this.applyFilter(this.rideCreateForm.controls.startingAddress);
    this.destinationAddressOptions = this.applyFilter(this.rideCreateForm.controls.destinationAddress);
    this.passengerOptions = this.applyPassengerFilter(this.rideCreateForm.controls.passengers);

    this.loadCars();
    this.loadUsers();

    this.setAvailableCars();
  }

  fillFormFields(): void {
    this.rideCreateForm.controls.purpose.setValue(this.ride.purpose);
    this.rideCreateForm.controls.startingAddress.setValue(this.ride.startAddress);
    this.rideCreateForm.controls.destinationAddress.setValue(this.ride.destinationAddress);

    const startDateTime = new Date(this.ride.startDate);
    const endDateTime = new Date(this.ride.endDate);

    this.rideCreateForm.controls.startDate.setValue(startOfDay(startDateTime));
    this.rideCreateForm.controls.startTime.setValue(toTimeString(startDateTime));
    this.rideCreateForm.controls.endDate.setValue(startOfDay(endDateTime));
    this.rideCreateForm.controls.endTime.setValue(toTimeString(endDateTime));

    this.selectedCar = this.cars.find(car => car.id === this.ride.carId) || null;
  }

  loadCars(): void {
    this.carService.listAll().subscribe({ next: cars => {
        this.cars = cars;
        this.fillFormFields();
      }});
  }

  getStartDate(): Date {
    return this.rideCreateForm.controls.startDate.getRawValue()!;
  }

  getEndDate(): Date {
    return this.rideCreateForm.controls.endDate.getRawValue()!;
  }

  getStartTime(): string {
    return this.rideCreateForm.controls.startTime.getRawValue()!;
  }

  getEndTime(): string {
    return this.rideCreateForm.controls.endTime.getRawValue()!;
  }

  getRides(): Observable<Ride[]> {
    return !this.rides.length ? this.rideService.listAll_1() : of(this.rides);
  }

  setAvailableCars(): void {
    this.getRides().pipe(map(rides => {
      let availableCars = filterAvailableCars(this.cars, rides, this.getStartDate(), this.getEndDate(),
        this.getStartTime(), this.getEndTime(), this.passengers.length);
      const currentCar = this.cars.find(car => car.id === this.ride.carId);
      if (currentCar && !availableCars.includes(currentCar)) {
        // availableCars = [ currentCar, ...availableCars ];
        availableCars.push(currentCar);
      }
      return availableCars;
    })).subscribe(availableCars => this.availableCars = availableCars);
  }

  updateAvailableCars(): void {
    const startDate = this.rideCreateForm.controls.startDate.getRawValue();
    const endDate = this.rideCreateForm.controls.endDate.getRawValue();
    if (!startDate || !endDate) {
      return;
    }
    this.setAvailableCars();
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({ next: userInfos => {
        this.fillPassangerArrays(userInfos);
        this.passengerInfos = userInfos;
      }});
  }

  findCurrentPassengers(): Observable<string[]> {
    if (!this.loadedCurrentPassengers) {
      return this.reservationService.listAll_2().pipe(map(reservations => {
        const foundPassengers: UserInfo[] = [];
        for (const reservation of reservations) {
          if (reservation.rideId !== this.ride.id) {
            continue;
          }
          for (const userInfo of this.passengerInfos) {
            if (userInfo.id === parseInt(reservation.userId)) {
              foundPassengers.push(userInfo);
            }
          }
        }
        this.loadedCurrentPassengers = true;
        this.passengers = foundPassengers;
        return foundPassengers.map(this.getFullName);
      }));
    }
    return of(this.passengers.map(this.getFullName));
  }

  fillPassangerArrays(userInfos: UserInfo[]): void {
    this.allPassengers = userInfos.map(userInfo => this.getFullName(userInfo));
  }

  deleteRideWithReservation(): void {
    const deleteObservables: Observable<void>[] = [];
    this.reservationService.listAll_2().subscribe(reservations => {
      for (const reservation of reservations) {
        if (reservation.rideId === this.ride.id) {
          deleteObservables.push(this.reservationService.delete_2({id: reservation.id!}));
        }
      }
      (deleteObservables.length ?  forkJoin(deleteObservables) : of([]))
        .subscribe(() => {
          this.rideService.delete_1({ id: this.ride.id! })
            .subscribe(() => this.dialogRef.close(true));
        });
    });
  }

  updateRideWithReservations(): void {
    const ride: Ride = {
      carId: this.selectedCar!.id!,
      startDate: formatDateTimeISO8601(this.getStartDate(), this.getStartTime()),
      endDate: formatDateTimeISO8601(this.getEndDate(), this.getEndTime()),
      startAddress: this.rideCreateForm.controls.startingAddress.getRawValue()!,
      destinationAddress: this.rideCreateForm.controls.destinationAddress.getRawValue()!,
      purpose: this.rideCreateForm.controls.purpose.getRawValue()!
    }

    this.rideService.update_1({ id: this.ride.id!, body: ride })
      .subscribe(ride => this.updateReservations(ride));
  }

  createReservationsForNewPassengers(allReservations: Reservation[]): void {
    for (const passenger of this.passengers) {
      let reservationForPassengerFound = false;
      for (const reservation of allReservations) {
        if (reservation.rideId !== this.ride.id) {
          continue;
        }
        if (parseInt(reservation.userId) === passenger.id) {
          reservationForPassengerFound = true;
          break;
        }
      }
      if (!reservationForPassengerFound) {
        this.reservationService.create_2({ body: { rideId: this.ride.id!, userId: passenger.id.toString() } })
          .subscribe();
      }
    }
  }

  deleteReservationsForRemovedPassengers(allReservations: Reservation[]): void {
    for (const reservation of allReservations) {
      if (reservation.rideId !== this.ride.id) {
        continue;
      }
      let foundPassenger = false;
      const passengerId = parseInt(reservation.userId);
      for (const passenger of this.passengers) {
        if (passengerId === passenger.id) {
          foundPassenger = true;
          break;
        }
      }
      if (!foundPassenger) {
        this.reservationService.delete_2({ id: reservation.id! }).subscribe();
      }
    }
  }

  updateReservations(ride: Ride): void {
    if (!ride.id) {
      return;
    }
    this.reservationService.listAll_2().subscribe(reservations => {
      this.createReservationsForNewPassengers(reservations);
      this.deleteReservationsForRemovedPassengers(reservations);
    });
    this.dialogRef.close(true);
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
      (passenger ? this.passengerFilter(passenger)
                 : this.allPassengers.filter(passenger => !this.passengers.map(this.getFullName).includes(passenger)))));
  }

  passengerFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allPassengers.filter(passenger => !this.passengers.map(this.getFullName).includes(passenger)
      && passenger.toLowerCase().includes(filterValue));
  }

  addPassenger(event: MatChipInputEvent): void {
    if (!this.selectedCar) {
      return;
    }
    const value = (event.value || '').trim();
    if (value && this.allPassengers.includes(value) && this.passengers.length < this.selectedCar.seats) {
      const passengerInfo = this.passengerInfos
        .find(info => this.getFullName(info) === value);
      if (!passengerInfo) {
        return;
      }
      this.passengers.push(passengerInfo);
      this.updateAvailableCars();
    }
    event.chipInput!.clear();
    this.rideCreateForm.controls.passengers.setValue(null);
  }

  removePassenger(passenger: string) {
    const index = this.passengers.map(this.getFullName).indexOf(passenger);
    if (index >= 0) {
      this.passengers.splice(index, 1);
      this.updateAvailableCars();
    }
  }

  selectedPassenger(event: MatAutocompleteSelectedEvent) {
    if (!this.selectedCar || this.passengers.length >= this.selectedCar.seats) {
      return;
    }
    const passengerInfo = this.passengerInfos
      .find(info => this.getFullName(info) === event.option.viewValue);
    if (!passengerInfo) {
      return;
    }
    this.passengers.push(passengerInfo);
    this.updateAvailableCars();
    this.rideCreateForm.controls.passengers.setValue(null);
  }

  dateTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const startDate = this.rideCreateForm?.controls.startDate.getRawValue();
      const endDate = this.rideCreateForm?.controls.endDate.getRawValue();

      const startTimeControl = this.rideCreateForm?.controls.startTime;
      const endTimeControl = this.rideCreateForm?.controls.endTime;
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
}

