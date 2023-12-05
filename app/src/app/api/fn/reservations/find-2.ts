/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Reservation } from '../../models/reservation';

export interface Find_2$Params {
  id: number;
}

export function find_2(http: HttpClient, rootUrl: string, params: Find_2$Params, context?: HttpContext): Observable<StrictHttpResponse<Reservation>> {
  const rb = new RequestBuilder(rootUrl, find_2.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Reservation>;
    })
  );
}

find_2.PATH = '/reservations/{id}';
