import { Component } from '@angular/core';
import {ToolBarComponent} from "../tool-bar/tool-bar.component";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [
    ToolBarComponent
  ],
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})

export class LogoutComponent {

  constructor(public dialog: MatDialog) {}

  logout() {
    localStorage.clear();
  }

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(ConfirmLogoutDialog);


  }
}

  @Component({
    selector: 'confirm-logout-dialog',
    templateUrl: '../tool-bar/confirm-logout-dialog.html',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
  })
  export class ConfirmLogoutDialog {}
