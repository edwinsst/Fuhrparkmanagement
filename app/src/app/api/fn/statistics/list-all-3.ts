/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { UserStatistic } from '../../models/user-statistic';

export interface ListAll_3$Params {
  currentMonth?: boolean;
}

export function listAll_3(http: HttpClient, rootUrl: string, params?: ListAll_3$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<UserStatistic>>> {
  const rb = new RequestBuilder(rootUrl, listAll_3.PATH, 'get');
  if (params) {
    rb.query('currentMonth', params.currentMonth, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<UserStatistic>>;
    })
  );
}

listAll_3.PATH = '/statistics/users';
