import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarBigComponent } from './calendar-big.component';
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatDialogModule} from "@angular/material/dialog";

describe('CalendarBigComponent', () => {
  let component: CalendarBigComponent;
  let fixture: ComponentFixture<CalendarBigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CalendarBigComponent, HttpClientTestingModule, MatDialogModule,
        CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory})]
    });
    fixture = TestBed.createComponent(CalendarBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
