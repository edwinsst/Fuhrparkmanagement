import {Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../material/material.module";
import {ToolBarComponent} from "../tool-bar/tool-bar.component";
import {AuthenticationService} from "../authentication.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";

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

  constructor(private authService: AuthenticationService, private router: Router, private titleService: Title) {
    titleService.setTitle("Login | Fuhrparkmanagement");
  }

  ngOnInit(): void {
    this.authService.loadLongTimeTokenAndUserInfo();
    if (!this.authService.longTimeToken) {
      return;
    }
    this.authService.generateShortTimeToken()
      .subscribe({ next: () => this.router.navigate([ '/home' ]) });
  }

  login(): void {
    const username = this.loginForm.controls.username.getRawValue() || '';
    const password = this.loginForm.controls.password.getRawValue() || '';

    this.authService.authenticate(username, password)
      .subscribe({
        next: () => {
          this.authService.saveLongTimeTokenAndUserInfo();
          this.authService.generateShortTimeToken()
            .subscribe(() => this.router.navigate([ '/home' ]));
        },
        error: () => this.wrongCredentials = true
      });
  }

  triggerLog({e}: { e: any }): void{
    if(e.pointerType === 'mouse'){
      console.log(e);
      this.hidePassword = !this.hidePassword;
    }else {
      console.log(e);
      this.login();
    }
  }

}
