import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {map, Observable} from "rxjs";

export const AUTH_API_URL = 'http://localhost:8082/usermanagement/v2';
const AUTH_STORAGE_TOKEN_KEY = 'longTimeToken';
const AUTH_STORAGE_USER_INFO_KEY = 'userInfo';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  longTimeToken = '';
  shortTimeToken = '';
  userInfo?: UserInfo;

  constructor(private httpClient: HttpClient) { }

  loadLongTimeTokenAndUserInfo(): void {
    this.longTimeToken = localStorage.getItem(AUTH_STORAGE_TOKEN_KEY) || '';
    const encodedUserInfo = localStorage.getItem(AUTH_STORAGE_USER_INFO_KEY);
    if (encodedUserInfo) {
      this.userInfo = JSON.parse(encodedUserInfo);
    }
  }

  saveLongTimeTokenAndUserInfo(): void {
    localStorage.setItem(AUTH_STORAGE_TOKEN_KEY, this.longTimeToken);
    localStorage.setItem(AUTH_STORAGE_USER_INFO_KEY, JSON.stringify(this.userInfo));
  }

  authenticate(username: string, password: string): Observable<string> {
    return this.httpClient.post<any>(AUTH_API_URL + '/authenticate', { name: username, password: password })
      .pipe(map(result => {
        this.longTimeToken = result.token;
        this.userInfo = {
          id: result.user.id,
          firstName: result.user.givenName,
          lastName: result.user.surname,
          mail: result.user.mail
        };
        return result;
      }));
  }

  generateShortTimeToken(): Observable<string> {
    return this.httpClient.post<any>(AUTH_API_URL + '/tokens/renew', null,
      { headers: new HttpHeaders({'Authorization': 'Bearer ' + this.longTimeToken}) })
      .pipe(map(result => this.shortTimeToken = result.token));
  }

  logout(): void {
    this.httpClient.post(AUTH_API_URL + '/tokens/revoke', null,
      { headers: new HttpHeaders({ 'Authorization': 'Bearer ' + this.longTimeToken }) })
      .subscribe(result => {
        this.longTimeToken = '';
        this.shortTimeToken = '';
        this.userInfo = undefined;
      });
    localStorage.clear();
  }

  getUsers(): Observable<UserInfo[]> {
    return this.httpClient.get(AUTH_API_URL + '/users', { headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.shortTimeToken }) })
      .pipe(map(array => (array as any[]).map(element =>
        ({
          id: element.id,
          firstName: element.givenName,
          lastName: element.surname,
          mail: element.mail
        } as UserInfo))));
  }
}

export interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  mail: string;
}
