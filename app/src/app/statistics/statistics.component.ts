import { Component } from '@angular/core';
import {ToolBarComponent} from "../tool-bar/tool-bar.component";
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {Title} from "@angular/platform-browser";
import {APP_NAME} from "../app.component"
import {NgClass, NgIf} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {StatisticsService} from "../api/services/statistics.service";
import {UserStatistic} from "../api/models/user-statistic";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  standalone: true,
  imports: [
    ToolBarComponent, MatTableModule, MatPaginatorModule, NgClass, MatButtonModule, MatFormFieldModule, MatOptionModule, MatSelectModule, NgIf, ReactiveFormsModule
  ],

})


export class StatisticsComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'fahrten'];
  dataSource = new MatTableDataSource<UserStatistic>();
  displayedRange = new FormControl('1');

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private statisticService: StatisticsService,
    private titleService: Title

  ) {
    titleService.setTitle("Statistik | " + APP_NAME);
  }

  ngOnInit(): void {
    this.loadStatistics(false);
    this.displayedRange.valueChanges.subscribe(value => {
      if (value == null) {
        return;
      }
      const currentMonth = value == '0';
      this.loadStatistics(currentMonth);
    });
  }

  loadStatistics(currentMonth: boolean): void {
    this.statisticService.listAll_3({ currentMonth: currentMonth })
      .subscribe({next: statitics => this.dataSource.data = statitics});
  }

  getRowPosition(userStatistic: UserStatistic): number {
    return this.dataSource.data.indexOf(userStatistic) + 1;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
