import {Component} from "@angular/core";
import {MatDialogModule} from "@angular/material/dialog";
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

const TIME_REGEX = /(?<hour>[0-9]{2}):(?<minute>[0-9]{2})/

@Component({
  selector: 'ride-create-dialog',
  templateUrl: 'ride-create-dialog.component.html',
  styleUrl: 'ride-create-dialog.component.css',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatButtonModule, MatStepperModule, ReactiveFormsModule, MatInputModule, NgIf, MatDatepickerModule, MatAutocompleteModule, NgForOf, AsyncPipe, MatListModule, MatGridListModule, MatChipsModule, MatIconModule, MatCardModule],
})
export class RideCreateDialogComponent {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

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
  addressOptions = [ 'Stuttgart Feuerbach', 'Karlsruhe', 'Friedrichshafen' ];

  passengers: string[] = [];
  allPassengers: string[] = [];
  passengerOptions: Observable<string[]>;

  availableCars: Observable<Car[]>
  selectedCar: Car | null
  cars: Car[] = []

  constructor(private carService: CarsService, private rideService: RidesService, private authService: AuthenticationService) {
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

  getAvailableCars(): Observable<Car[]> {
    return this.rideService.listAll_1().pipe(map(rides => this.filterAvailableCars(rides)));
  }

  filterAvailableCars(rides: Ride[]): Car[] {
    let startDate = this.rideCreateStep1Form.controls.startDate.getRawValue()!;
    let endDate = this.rideCreateStep1Form.controls.endDate.getRawValue()!;
    const startTime = this.parseTime(this.rideCreateStep1Form.controls.startTime.getRawValue());
    const endTime = this.parseTime(this.rideCreateStep1Form.controls.startTime.getRawValue());

    startDate = this.getDateWithTime(startDate, startTime);
    endDate = this.getDateWithTime(endDate, endTime);

    return this.cars.filter(car => {
      for (const ride of rides) {
        if (ride.carId !== car.id) {
          continue;
        }
        const rideStartDate = new Date(ride.startDate);
        const rideEndDate = new Date(ride.endDate);
        if (startDate.getTime() < rideEndDate.getTime() && rideStartDate.getTime() < endDate.getTime()) {
          return false;
        }
      }
      return true;
    });
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({ next: userInfos => this.fillPassangerArrays(userInfos) });
  }

  createRideWithReservations(): void {
    const startDate = this.rideCreateStep1Form.controls.startDate.getRawValue()!;
    const endDate = this.rideCreateStep1Form.controls.endDate.getRawValue()!;

    const ride: Ride = {
      carId: this.selectedCar!.id!,
      startDate: this.formatDate(startDate, this.rideCreateStep1Form.controls.startTime.getRawValue()!),
      endDate: this.formatDate(endDate, this.rideCreateStep1Form.controls.startTime.getRawValue()!),
      startAddress: this.rideCreateStep1Form.controls.startingAddress.getRawValue()!,
      destinationAddress: this.rideCreateStep1Form.controls.startingAddress.getRawValue()!,
      purpose: this.rideCreateStep1Form.controls.purpose.getRawValue()!
    }

    this.rideService.create_1({ body: ride }).subscribe(ride => this.createReservations(ride));
  }

  createReservations(ride: Ride): void {
    // TODO
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
    if (value && this.allPassengers.includes(value)) {
      this.passengers.push(value);
    }
    event.chipInput!.clear();
    this.rideCreateStep2Form.controls.passengers.setValue(null);
  }

  removePassenger(passenger: string) {
    const index = this.passengers.indexOf(passenger);
    if (index >= 0) {
      this.passengers.splice(index, 1);
    }
  }

  selectedPassenger(event: MatAutocompleteSelectedEvent) {
    this.passengers.push(event.option.viewValue);
    this.rideCreateStep2Form.controls.passengers.setValue(null);
  }

  parseTime(time: string | null): [number, number] {
    if (!time) {
      return [99, 99];
    }
    const timeRegexMatch = String(time).match(TIME_REGEX);
    if (timeRegexMatch?.groups) {
      const hour = parseInt(timeRegexMatch.groups['hour']);
      const minute = parseInt(timeRegexMatch.groups['minute']);
      return [hour, minute];
    }
    return [99, 99];
  }

  getDateWithTime(date: Date, time: [number, number]): Date {
    date = new Date(date.getTime());
    date.setHours(time[0]);
    date.setMinutes(time[1]);
    return date;
  }

  formatDateTime(date: Date | null, timeStr: string | null): string {
    if (!date || !timeStr) {
      return '';
    }
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} (${timeStr} Uhr)`;
  }

  formatDate(date: Date, timeStr: string): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${timeStr}:00.000Z`;
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

      const startTime = this.parseTime(startTimeControl.getRawValue());
      const endTime = this.parseTime(endTimeControl.getRawValue());

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
    this.availableCars = this.getAvailableCars();
  }
}
