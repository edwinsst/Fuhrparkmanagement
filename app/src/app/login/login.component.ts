import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../material/material.module";
import {ToolBarComponent} from "../tool-bar/tool-bar.component";
import {AuthenticationService} from "../authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, ToolBarComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hidePassword = true;
  wrongCredentials = false;
  loginForm = new FormGroup({
    username: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ])
  });

  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit(): void {
    this.authService.loadLongTimeTokenFromLocalStorage();
    if (!this.authService.longTimeToken) {
      return;
    }
    this.authService.generateShortTimeToken()
      .subscribe(() => this.router.navigate([ '/home' ]));
  }

  login(): void {
    const username = this.loginForm.controls.username.getRawValue() || '';
    const password = this.loginForm.controls.password.getRawValue() || '';

    this.authService.authenticate(username, password)
      .subscribe({
        next: () => {
          this.authService.saveLongTimeToken();
          this.authService.generateShortTimeToken()
            .subscribe(() => this.router.navigate([ '/home' ]));
        },
        error: () => this.wrongCredentials = true
      });
  }
}
