import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {first, mergeMap, Observable} from "rxjs";
import {AUTH_API_URL, AuthenticationService} from "../authentication.service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private authService: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(AUTH_API_URL)) {
      return next.handle(req);
    }

    if (!this.authService.shortTimeToken) {
      return this.authService.generateShortTimeToken()
        .pipe(first(), mergeMap(_ => this.withAuthentication(req, next)));
    }

    return this.withAuthentication(req, next);
  }

  withAuthentication(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req.clone({
      setHeaders: {
        'Authorization': 'Bearer ' + this.authService.shortTimeToken
      }
    }));
  }
}
