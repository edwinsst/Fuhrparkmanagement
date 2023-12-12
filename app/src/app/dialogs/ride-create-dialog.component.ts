import {Component} from "@angular/core";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatStepperModule} from "@angular/material/stepper";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatFormFieldModule} from "@angular/material/form-field";
import {Observable, startWith} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'ride-create-dialog',
  templateUrl: 'ride-create-dialog.component.html',
  styleUrl: 'ride-create-dialog.component.css',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatButtonModule, MatStepperModule, ReactiveFormsModule, MatInputModule, NgIf, MatDatepickerModule, MatAutocompleteModule, NgForOf, AsyncPipe],
})
export class RideCreateDialogComponent {
  rideCreateStep1Form = new FormGroup({
    purpose: new FormControl('', [Validators.required]),
    startingAddress: new FormControl('', [Validators.required]),
    destinationAddress: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    endDate: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
  });

  rideCreateStep2Form = new FormGroup({
    car: new FormControl('', [Validators.required])
  });

  startingAddressOptions: Observable<string[]>;
  destinationAddressOptions: Observable<string[]>;
  addressOptions = [ 'Stuttgart Feuerbach', 'Karlsruhe', 'Friedrichshafen' ];

  ngOnInit(): void {
    this.startingAddressOptions = this.applyFilter(this.rideCreateStep1Form.controls.startingAddress);
    this.destinationAddressOptions = this.applyFilter(this.rideCreateStep1Form.controls.destinationAddress);
  }

  applyFilter(formControl: FormControl<string | null>): Observable<string[]> {
    return formControl.valueChanges.pipe(startWith(''), map(value =>
        this.addressOptions.filter(option => option.toLowerCase().includes(value?.toLowerCase() || ''))));
  }
}
