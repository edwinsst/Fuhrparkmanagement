import {Ride} from "./api/models/ride";
import {Car} from "./api/models/car";
import {getDateWithTime, parseTime} from "./date-time-utils";
import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function filterAvailableCars(cars: Car[], rides: Ride[],
                                    currentCar: Car | undefined,
                                    startDate: Date, endDate: Date,
                                    startTimeStr: string, endTimeStr: string,
                                    passengersAmount: number,
                                    startAddress: string): Car[]
{
  const startTime = parseTime(startTimeStr);
  const endTime = parseTime(endTimeStr);

  startDate = getDateWithTime(startDate, startTime);
  endDate = getDateWithTime(endDate, endTime);

  return cars.filter(car => {
    if (car.seats < passengersAmount) {
      return false;
    }
    if (car.location.toLowerCase() !== startAddress.toLowerCase()) {
      return false;
    }
    if (car.id === currentCar?.id) {
      return true;
    }
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

export function dateTimeValidator(startDateFormControl: FormControl<Date | null>,
                                  endDateFormControl: FormControl<Date | null>,
                                  startTimeFormControl: FormControl<string | null>,
                                  endTimeFormControl: FormControl<string | null>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const startDate = startDateFormControl.getRawValue();
    const endDate = endDateFormControl.getRawValue();

    if (!startTimeFormControl || !endTimeFormControl) {
      return null;
    }

    const startTime = parseTime(startTimeFormControl.getRawValue());
    const endTime = parseTime(endTimeFormControl.getRawValue());

    const isEndTimeBeforeStartTime = startTime[0] > endTime[0]
      || (startTime[0] === endTime[0] && startTime[1] > endTime[1]);

    // The end date cannot be before the start date, when they are selected with the date range picker
    // However if they are on the same date, then we need to check if the end time is before the start time
    if (startDate?.getTime() === endDate?.getTime() && isEndTimeBeforeStartTime) {
      const errors: ValidationErrors = { endBeforeStart: true };
      startTimeFormControl.setErrors(errors);
      endTimeFormControl.setErrors(errors);

      if (control == startTimeFormControl || control == endTimeFormControl) {
        return errors;
      }
      return null;
    }

    if (startTimeFormControl.hasError('endBeforeStart')) {
      startTimeFormControl.setErrors(null);
    }
    if (endTimeFormControl.hasError('endBeforeStart')) {
      endTimeFormControl.setErrors(null);
    }
    return null;
  };
}
