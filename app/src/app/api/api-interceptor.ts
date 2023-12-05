import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AUTH_API_URL, AuthenticationService} from "../authentication.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  authService = inject(AuthenticationService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(AUTH_API_URL)) {
      return next.handle(req);
    }

    if (!this.authService.shortTimeToken) {
      // this.authService.generateShortTimeToken();
      console.error('no short time token');
    }

    req = req.clone({
      setHeaders: {
        'Authentication': 'Bearer ' + this.authService.shortTimeToken
      }
    });

    return next.handle(req);
  }
}
