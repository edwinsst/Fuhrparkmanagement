import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarBigComponent } from './calendar-big.component';

describe('CalendarBigComponent', () => {
  let component: CalendarBigComponent;
  let fixture: ComponentFixture<CalendarBigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarBigComponent]
    });
    fixture = TestBed.createComponent(CalendarBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
