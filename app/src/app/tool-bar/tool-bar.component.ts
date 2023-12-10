import { Component } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {NgOptimizedImage} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, NgOptimizedImage, MatMenuModule, RouterLink],
})

export class ToolBarComponent {

  constructor(public dialog: MatDialog, private authService: AuthenticationService, private router: Router) {
  }


  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(ConfirmLogoutDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.router.navigate(['/home']);
        return;
      }
      this.authService.logout()
      this.router.navigate(['/']);
    });
  }
}

@Component({
  selector: 'confirm-logout-dialog',
  templateUrl: '../tool-bar/confirm-logout-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmLogoutDialog {}

