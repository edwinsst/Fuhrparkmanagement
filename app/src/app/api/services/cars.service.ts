/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { Car } from '../models/car';
import { create } from '../fn/cars/create';
import { Create$Params } from '../fn/cars/create';
import { delete$ } from '../fn/cars/delete';
import { Delete$Params } from '../fn/cars/delete';
import { find } from '../fn/cars/find';
import { Find$Params } from '../fn/cars/find';
import { listAll } from '../fn/cars/list-all';
import { ListAll$Params } from '../fn/cars/list-all';
import { update } from '../fn/cars/update';
import { Update$Params } from '../fn/cars/update';


/**
 * Cars with their attributes
 */
@Injectable({ providedIn: 'root' })
export class CarsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `listAll()` */
  static readonly ListAllPath = '/cars';

  /**
   * GET cars.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listAll()` instead.
   *
   * This method doesn't expect any request body.
   */
  listAll$Response(params?: ListAll$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Car>>> {
    return listAll(this.http, this.rootUrl, params, context);
  }

  /**
   * GET cars.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `listAll$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listAll(params?: ListAll$Params, context?: HttpContext): Observable<Array<Car>> {
    return this.listAll$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<Car>>): Array<Car> => r.body)
    );
  }

  /** Path part for operation `create()` */
  static readonly CreatePath = '/cars';

  /**
   * POST cars.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `create()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create$Response(params: Create$Params, context?: HttpContext): Observable<StrictHttpResponse<Car>> {
    return create(this.http, this.rootUrl, params, context);
  }

  /**
   * POST cars.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `create$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  create(params: Create$Params, context?: HttpContext): Observable<Car> {
    return this.create$Response(params, context).pipe(
      map((r: StrictHttpResponse<Car>): Car => r.body)
    );
  }

  /** Path part for operation `find()` */
  static readonly FindPath = '/cars/{id}';

  /**
   * GET cars/{id}.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `find()` instead.
   *
   * This method doesn't expect any request body.
   */
  find$Response(params: Find$Params, context?: HttpContext): Observable<StrictHttpResponse<Car>> {
    return find(this.http, this.rootUrl, params, context);
  }

  /**
   * GET cars/{id}.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `find$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  find(params: Find$Params, context?: HttpContext): Observable<Car> {
    return this.find$Response(params, context).pipe(
      map((r: StrictHttpResponse<Car>): Car => r.body)
    );
  }

  /** Path part for operation `update()` */
  static readonly UpdatePath = '/cars/{id}';

  /**
   * PUT cars/{id}.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `update()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  update$Response(params: Update$Params, context?: HttpContext): Observable<StrictHttpResponse<Car>> {
    return update(this.http, this.rootUrl, params, context);
  }

  /**
   * PUT cars/{id}.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `update$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  update(params: Update$Params, context?: HttpContext): Observable<Car> {
    return this.update$Response(params, context).pipe(
      map((r: StrictHttpResponse<Car>): Car => r.body)
    );
  }

  /** Path part for operation `delete()` */
  static readonly DeletePath = '/cars/{id}';

  /**
   * DELETE cars/{id}.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `delete()` instead.
   *
   * This method doesn't expect any request body.
   */
  delete$Response(params: Delete$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return delete$(this.http, this.rootUrl, params, context);
  }

  /**
   * DELETE cars/{id}.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `delete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  delete(params: Delete$Params, context?: HttpContext): Observable<void> {
    return this.delete$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
