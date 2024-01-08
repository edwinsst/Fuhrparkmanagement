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
import {AuthenticationService, UserInfo} from "../authentication.service";
import {Observable, of, startWith} from "rxjs";
import {map} from "rxjs/operators";
// import {getFullName} from "../dialogs/ride-create-dialog.component";

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
  filterUsers = new FormControl('0');

  loadedCars: Car[] = [];
  loadedRideReservations: Reservation[] = [];

  // ride: Ride;
  // rides: Ride[] = [];

  passengers: string[] = [];
  allPassengers: string[] = [];
  passengerInfos: UserInfo[] = [];

  displayedRideColumns: string[] = ['purpose', 'startAddress', 'destinationAddress', 'startDate', 'endDate',
    'model_name', 'userid'];
  loadedRides: Ride[] = [];

  constructor(private carService: CarsService, private rideService: RidesService,
              private reservationService: ReservationsService, public dialog: MatDialog, private titleService: Title,
              private authService: AuthenticationService) {
    titleService.setTitle("Alle Fahrten | " + APP_NAME)
  }

  ngOnInit(): void {
    this.loadCars();
    this.loadRides();
    this.loadRideReservation()
    this.loadUsers();

    this.filterUsers.valueChanges.subscribe(value => {
      if(value == '0'){
        this.loadRides();
      }else if(value == '1'){
        const userid = this.authService.userInfo?.id.toString();
        let ridesForId: Ride[] = [];
        this.loadedRideReservations.filter(reservation => reservation.userId === userid)
          .forEach(reservation => {
            const foundRide = this.loadedRides.find(ride => ride.id === reservation.rideId);
            if(foundRide){
              ridesForId.push(foundRide);
            }
          })
        this.loadedRides = ridesForId;
      }
    });
  }

  getCarModelName(carId: number): string {
    const car = this.loadedCars.find(car => car.id === carId);
    return car ? car.modelName + ", " + car.licensePlate : 'N/A';
  }

  getUser(rideId: number): string[] {
    const reservationForRide = this.loadedRideReservations.filter(reservation => reservation.rideId === rideId);
    const userIds: string[] = [];
    this.passengers = [];

    for (const reservation of reservationForRide) {
      userIds.push(reservation.userId);
    }

    for (const passengerInfo of this.passengerInfos) {
      if (userIds.includes(String(passengerInfo.id)))
        this.passengers.push(passengerInfo.firstName + " " + passengerInfo.lastName);
    }
    return this.passengers;
  }

  loadCars(): void {
    this.carService.listAll().subscribe({ next: cars => this.loadedCars = cars });
  }

  loadRideReservation(): void {
    this.reservationService.listAll_2().subscribe({ next: reservation => this.loadedRideReservations = reservation });
  }

  loadRides(): void {
    this.rideService.listAll_1().subscribe({ next: rides => this.loadedRides = rides });
  }

  loadUsers(): void {
    this.authService.getUsers().subscribe({ next: userInfos => {
        this.fillPassengerArrays(userInfos);
        this.passengerInfos = userInfos;
      }});
  }

  fillPassengerArrays(userInfos: UserInfo[]): void {
    const currentUserInfo = this.authService.userInfo;
    if (currentUserInfo) {
      this.passengers = [ this.getFullName(currentUserInfo) ];
    }
    this.allPassengers = userInfos.map(userInfo => this.getFullName(userInfo));
  }

  getFullName(userInfo: UserInfo): string {
    return `${userInfo.firstName} ${userInfo.lastName}`;
  }

  // Convert dates from: 2023-12-27T11:11Z
  getConvertEndDate(endDate: string): string {
    const dataObj = new Date(endDate);
    let formattedDate = dataObj.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    formattedDate = formattedDate.replaceAll("um", "bis");

    return formattedDate;
  }

  getConvertStartDate(startDate: any): string {
    const dataObj = new Date(startDate);
    let formattedDate = dataObj.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    formattedDate = formattedDate.replaceAll("um", "von");
    return formattedDate;
  }
}
