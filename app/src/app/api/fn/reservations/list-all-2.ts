/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Reservation } from '../../models/reservation';

export interface ListAll_2$Params {
}

export function listAll_2(http: HttpClient, rootUrl: string, params?: ListAll_2$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Reservation>>> {
  const rb = new RequestBuilder(rootUrl, listAll_2.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Reservation>>;
    })
  );
}

listAll_2.PATH = '/reservations';
