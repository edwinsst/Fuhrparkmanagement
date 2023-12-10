import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";

export const AUTH_API_URL = 'http://localhost:8082/usermanagement/v2';
const AUTH_STORAGE_KEY = 'longTimeToken';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  longTimeToken = '';
  shortTimeToken = '';

  constructor(private httpClient: HttpClient) { }

  loadLongTimeTokenFromLocalStorage(): void {
    this.longTimeToken = localStorage.getItem(AUTH_STORAGE_KEY) || '';
  }

  saveLongTimeToken(): void {
    localStorage.setItem(AUTH_STORAGE_KEY, this.longTimeToken);
  }

  authenticate(username: string, password: string): Observable<string> {
    return this.httpClient.post<any>(AUTH_API_URL + '/authenticate', {name: username, password: password})
      .pipe(map(result => this.longTimeToken = result.token));
  }

  generateShortTimeToken(): Observable<string> {
    return this.httpClient.post<any>(AUTH_API_URL + '/tokens/renew', null,
      {headers: new HttpHeaders({'Authorization': 'Bearer ' + this.longTimeToken})})
      .pipe(map(result => this.shortTimeToken = result.token));
  }

  logout(): void {
    this.httpClient.post(AUTH_API_URL + '/tokens/revoke', null,
      { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.longTimeToken }) })
      .subscribe(result => this.longTimeToken = '');
    localStorage.clear();
  }
}
