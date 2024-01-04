import { Component } from '@angular/core';

import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AuthenticationService} from "../authentication.service";
import {APP_NAME} from "../app.component";

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.css'],
  standalone: true,
    imports: [MatToolbarModule, MatButtonModule, MatIconModule, NgOptimizedImage, MatMenuModule, RouterLink, NgIf],
})
export class ToolBarComponent {

  constructor(public dialog: MatDialog, public authService: AuthenticationService, private router: Router) {
  }


  openLogoutDialog(): void {
      const dialogRef = this.dialog.open(ConfirmLogoutDialog);

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.authService.logout();
              this.router.navigate(['/']);
          }
      });
  }

    protected readonly APP_NAME = APP_NAME;
}

@Component({
  selector: 'confirm-logout-dialog',
  templateUrl: '../tool-bar/confirm-logout-dialog.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class ConfirmLogoutDialog {}

