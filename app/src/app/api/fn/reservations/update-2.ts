/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Reservation } from '../../models/reservation';

export interface Update_2$Params {
  id: number;
      body: Reservation
}

export function update_2(http: HttpClient, rootUrl: string, params: Update_2$Params, context?: HttpContext): Observable<StrictHttpResponse<Reservation>> {
  const rb = new RequestBuilder(rootUrl, update_2.PATH, 'put');
  if (params) {
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');
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

update_2.PATH = '/reservations/{id}';
