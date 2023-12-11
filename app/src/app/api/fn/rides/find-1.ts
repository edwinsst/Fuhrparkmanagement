/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Ride } from '../../models/ride';

export interface Find_1$Params {
  id: number;
}

export function find_1(http: HttpClient, rootUrl: string, params: Find_1$Params, context?: HttpContext): Observable<StrictHttpResponse<Ride>> {
  const rb = new RequestBuilder(rootUrl, find_1.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Ride>;
    })
  );
}

find_1.PATH = '/rides/{id}';