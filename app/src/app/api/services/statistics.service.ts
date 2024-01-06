/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { find_3 } from '../fn/statistics/find-3';
import { Find_3$Params } from '../fn/statistics/find-3';
import { listAll_3 } from '../fn/statistics/list-all-3';
import { ListAll_3$Params } from '../fn/statistics/list-all-3';
import { UserStatistic } from '../models/user-statistic';


/**
 * Statistics; driven kilometers
 */
@Injectable({ providedIn: 'root' })
export class StatisticsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `listAll_3()` */
  static readonly ListAll_3Path = '/statistics/users';

  /**
   * GET statistics/users.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `listAll_3()` instead.
   *
   * This method doesn't expect any request body.
   */
  listAll_3$Response(params?: ListAll_3$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<UserStatistic>>> {
    return listAll_3(this.http, this.rootUrl, params, context);
  }

  /**
   * GET statistics/users.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `listAll_3$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  listAll_3(params?: ListAll_3$Params, context?: HttpContext): Observable<Array<UserStatistic>> {
    return this.listAll_3$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<UserStatistic>>): Array<UserStatistic> => r.body)
    );
  }

  /** Path part for operation `find_3()` */
  static readonly Find_3Path = '/statistics/users/{id}';

  /**
   * GET statistics/users/{id}.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `find_3()` instead.
   *
   * This method doesn't expect any request body.
   */
  find_3$Response(params: Find_3$Params, context?: HttpContext): Observable<StrictHttpResponse<UserStatistic>> {
    return find_3(this.http, this.rootUrl, params, context);
  }

  /**
   * GET statistics/users/{id}.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `find_3$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  find_3(params: Find_3$Params, context?: HttpContext): Observable<UserStatistic> {
    return this.find_3$Response(params, context).pipe(
      map((r: StrictHttpResponse<UserStatistic>): UserStatistic => r.body)
    );
  }

}
