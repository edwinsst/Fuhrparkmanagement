import { NgModule } from '@angular/core';

import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";

const MaterialComponents =[
  MatNativeDateModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatCardModule,
  MatInputModule
];


@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
