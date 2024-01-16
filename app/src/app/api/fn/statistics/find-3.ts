/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { UserStatistic } from '../../models/user-statistic';

export interface Find_3$Params {
  id: number;
  currentMonth?: boolean;
}

export function find_3(http: HttpClient, rootUrl: string, params: Find_3$Params, context?: HttpContext): Observable<StrictHttpResponse<UserStatistic>> {
  const rb = new RequestBuilder(rootUrl, find_3.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {});
    rb.query('currentMonth', params.currentMonth, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<UserStatistic>;
    })
  );
}

find_3.PATH = '/statistics/users/{id}';
