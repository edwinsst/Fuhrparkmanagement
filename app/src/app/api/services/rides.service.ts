/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { create_1 } from '../fn/rides/create-1';
import { Create_1$Params } from '../fn/rides/create-1';
import { delete_1 } from '../fn/rides/delete-1';
import { Delete_1$Params } from '../fn/rides/delete-1';
import { find_1 } from '../fn/rides/find-1';
import { Find_1$Params } from '../fn/rides/find-1';
import { listAll_1 } from '../fn/rides/list-all-1';
import { ListAll_1$Params } from '../fn/rides/list-all-1';
import { Ride } from '../models/ride';
import { update_1 } from '../fn/rides/update-1';
import { Update_1$Params } from '../fn/rides/update-1';


/**
 * Combines rides with reservations
 */
@Injectable({ providedIn: 'root' })
export class RidesService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `listAll_1()` */
  static readonly ListAll_1Path = '/rides';

  /**
   * GET rides.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listAll_1()` instead.
   *
   * This method doesn't expect any request body.
   */
  listAll_1$Response(params?: ListAll_1$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Ride>>> {
    return listAll_1(this.http, this.rootUrl, params, context);
  }

  /**
   * GET rides.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `listAll_1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listAll_1(params?: ListAll_1$Params, context?: HttpContext): Observable<Array<Ride>> {
    return this.listAll_1$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Ride>>): Array<Ride> => r.body)
    );
  }

  /** Path part for operation `create_1()` */
  static readonly Create_1Path = '/rides';

  /**
   * POST rides.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `create_1()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create_1$Response(params: Create_1$Params, context?: HttpContext): Observable<StrictHttpResponse<Ride>> {
    return create_1(this.http, this.rootUrl, params, context);
  }

  /**
   * POST rides.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `create_1$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create_1(params: Create_1$Params, context?: HttpContext): Observable<Ride> {
    return this.create_1$Response(params, context).pipe(
      map((r: StrictHttpResponse<Ride>): Ride => r.body)
    );
  }

  /** Path part for operation `find_1()` */
  static readonly Find_1Path = '/rides/{id}';

  /**
   * GET rides/{id}.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `find_1()` instead.
   *
   * This method doesn't expect any request body.
   */
  find_1$Response(params: Find_1$Params, context?: HttpContext): Observable<StrictHttpResponse<Ride>> {
    return find_1(this.http, this.rootUrl, params, context);
  }

  /**
   * GET rides/{id}.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `find_1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  find_1(params: Find_1$Params, context?: HttpContext): Observable<Ride> {
    return this.find_1$Response(params, context).pipe(
      map((r: StrictHttpResponse<Ride>): Ride => r.body)
    );
  }

  /** Path part for operation `update_1()` */
  static readonly Update_1Path = '/rides/{id}';

  /**
   * PUT rides/{id}.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `update_1()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  update_1$Response(params: Update_1$Params, context?: HttpContext): Observable<StrictHttpResponse<Ride>> {
    return update_1(this.http, this.rootUrl, params, context);
  }

  /**
   * PUT rides/{id}.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `update_1$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  update_1(params: Update_1$Params, context?: HttpContext): Observable<Ride> {
    return this.update_1$Response(params, context).pipe(
      map((r: StrictHttpResponse<Ride>): Ride => r.body)
    );
  }

  /** Path part for operation `delete_1()` */
  static readonly Delete_1Path = '/rides/{id}';

  /**
   * DELETE rides/{id}.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `delete_1()` instead.
   *
   * This method doesn't expect any request body.
   */
  delete_1$Response(params: Delete_1$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return delete_1(this.http, this.rootUrl, params, context);
  }

  /**
   * DELETE rides/{id}.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `delete_1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  delete_1(params: Delete_1$Params, context?: HttpContext): Observable<void> {
    return this.delete_1$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
