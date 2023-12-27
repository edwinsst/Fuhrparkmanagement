import {Component} from '@angular/core';
import {
  CalendarCommonModule,
  CalendarEvent,
  CalendarMonthModule,
  CalendarView,
  CalendarWeekModule
} from "angular-calendar";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours, startOfMonth,
} from 'date-fns';
import {MatDialog} from "@angular/material/dialog";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {RideCreateDialogComponent} from "../dialogs/ride-create-dialog.component";
import {RidesService} from "../api/services/rides.service";
import {Ride} from "../api/models/ride";
import {EditDialogComponent} from "../edit-dialog/edit-dialog.component";
import {be} from "date-fns/locale";

@Component({
  selector: 'app-calendar-big',
  templateUrl: './calendar-big.component.html',
  styleUrls: ['./calendar-big.component.css'],
  imports: [
    CalendarMonthModule,
    CalendarCommonModule,
    CommonModule,
    CalendarWeekModule,
    MatButtonModule
  ],
  standalone: true
})
export class CalendarBigComponent {
  view: CalendarView = CalendarView.Month;
  EVENT_LIMIT = 5;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [
    /*{
      start: subDays(startOfMonth(new Date()), 3),
      end: new Date(),
      title: 'Firmenausflug',
      color: { primary: '#ad2121', secondary: '#FAE3E3' },
      allDay: true,
    }*/
  ];

  constructor(private rideService: RidesService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadRides();
  }

  createEvents(rides: Ride[]): CalendarEvent[] {
    return rides.map(ride => ({
        id: ride.id,
        start: new Date(ride.startDate),
        end: new Date(ride.endDate),
        title: ride.purpose,
        color: { primary: '#ad2121', secondary: '#FAE3E3' }
      } as CalendarEvent));
  }

  loadRides(): void {
    this.rideService.listAll_1().subscribe(rides => this.events = this.createEvents(rides));
  }

  eventClicked(event: CalendarEvent) {
    if (!event.id) {
      return;
    }
    this.rideService.find_1({ id: event.id as number }).subscribe(ride => {
      const dialogRef = this.dialog.open(EditDialogComponent);
      dialogRef.componentInstance.ride = ride;
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadRides();
        }
      });
    });
  }

  dayClicked(date: Date) {
    //this.dialog.open(ConfirmContentDialog);
  }

  handleMoreEvent(e: any , events: any[]) {

  }

  openRideCreateDialog(): void {
    const dialogRef = this.dialog.open(RideCreateDialogComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadRides();
      }
    })
  }

  protected readonly CalendarView = CalendarView;
}

