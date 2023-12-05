import {CanActivateFn, Router} from '@angular/router';
import {inject, Injectable} from "@angular/core";
import {AuthenticationService} from "./authentication.service";

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  authService.loadLongTimeTokenFromLocalStorage();
  if (!authService.longTimeToken) {
    navigateToLogin(router);
    return false;
  }
  authService.generateShortTimeToken().subscribe({ error: () => navigateToLogin(router) })
  return true;
};

function navigateToLogin(router: Router): void {
  router.navigate( [ '/' ]);
}
