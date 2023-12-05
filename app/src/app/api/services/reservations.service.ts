/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { create_2 } from '../fn/reservations/create-2';
import { Create_2$Params } from '../fn/reservations/create-2';
import { delete_2 } from '../fn/reservations/delete-2';
import { Delete_2$Params } from '../fn/reservations/delete-2';
import { find_2 } from '../fn/reservations/find-2';
import { Find_2$Params } from '../fn/reservations/find-2';
import { listAll_2 } from '../fn/reservations/list-all-2';
import { ListAll_2$Params } from '../fn/reservations/list-all-2';
import { Reservation } from '../models/reservation';
import { update_2 } from '../fn/reservations/update-2';
import { Update_2$Params } from '../fn/reservations/update-2';


/**
 * Reservation
 */
@Injectable({ providedIn: 'root' })
export class ReservationsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `listAll_2()` */
  static readonly ListAll_2Path = '/reservations';

  /**
   * GET reservations.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listAll_2()` instead.
   *
   * This method doesn't expect any request body.
   */
  listAll_2$Response(params?: ListAll_2$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Reservation>>> {
    return listAll_2(this.http, this.rootUrl, params, context);
  }

  /**
   * GET reservations.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `listAll_2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listAll_2(params?: ListAll_2$Params, context?: HttpContext): Observable<Array<Reservation>> {
    return this.listAll_2$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Reservation>>): Array<Reservation> => r.body)
    );
  }

  /** Path part for operation `create_2()` */
  static readonly Create_2Path = '/reservations';

  /**
   * POST reservations.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `create_2()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create_2$Response(params: Create_2$Params, context?: HttpContext): Observable<StrictHttpResponse<Reservation>> {
    return create_2(this.http, this.rootUrl, params, context);
  }

  /**
   * POST reservations.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `create_2$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create_2(params: Create_2$Params, context?: HttpContext): Observable<Reservation> {
    return this.create_2$Response(params, context).pipe(
      map((r: StrictHttpResponse<Reservation>): Reservation => r.body)
    );
  }

  /** Path part for operation `find_2()` */
  static readonly Find_2Path = '/reservations/{id}';

  /**
   * GET reservations/{id}.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `find_2()` instead.
   *
   * This method doesn't expect any request body.
   */
  find_2$Response(params: Find_2$Params, context?: HttpContext): Observable<StrictHttpResponse<Reservation>> {
    return find_2(this.http, this.rootUrl, params, context);
  }

  /**
   * GET reservations/{id}.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `find_2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  find_2(params: Find_2$Params, context?: HttpContext): Observable<Reservation> {
    return this.find_2$Response(params, context).pipe(
      map((r: StrictHttpResponse<Reservation>): Reservation => r.body)
    );
  }

  /** Path part for operation `update_2()` */
  static readonly Update_2Path = '/reservations/{id}';

  /**
   * PUT reservations/{id}.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `update_2()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  update_2$Response(params: Update_2$Params, context?: HttpContext): Observable<StrictHttpResponse<Reservation>> {
    return update_2(this.http, this.rootUrl, params, context);
  }

  /**
   * PUT reservations/{id}.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `update_2$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  update_2(params: Update_2$Params, context?: HttpContext): Observable<Reservation> {
    return this.update_2$Response(params, context).pipe(
      map((r: StrictHttpResponse<Reservation>): Reservation => r.body)
    );
  }

  /** Path part for operation `delete_2()` */
  static readonly Delete_2Path = '/reservations/{id}';

  /**
   * DELETE reservations/{id}.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `delete_2()` instead.
   *
   * This method doesn't expect any request body.
   */
  delete_2$Response(params: Delete_2$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return delete_2(this.http, this.rootUrl, params, context);
  }

  /**
   * DELETE reservations/{id}.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `delete_2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  delete_2(params: Delete_2$Params, context?: HttpContext): Observable<void> {
    return this.delete_2$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
