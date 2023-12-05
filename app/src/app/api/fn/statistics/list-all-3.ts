/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Statistic } from '../../models/statistic';

export interface ListAll_3$Params {
}

export function listAll_3(http: HttpClient, rootUrl: string, params?: ListAll_3$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Statistic>>> {
  const rb = new RequestBuilder(rootUrl, listAll_3.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Statistic>>;
    })
  );
}

listAll_3.PATH = '/statistics/users';
