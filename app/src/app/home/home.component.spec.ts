import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import {
  CalendarModule,
  DateAdapter
} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {registerLocaleData} from "@angular/common";
import localeDe from "@angular/common/locales/de";

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    registerLocaleData(localeDe);

    TestBed.configureTestingModule({
      imports: [HomeComponent, HttpClientTestingModule, BrowserAnimationsModule, CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory})]
    });
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
