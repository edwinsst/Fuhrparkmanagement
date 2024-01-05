/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Ride } from '../../models/ride';

export interface Update_1$Params {
  id: number;
      body: Ride
}

export function update_1(http: HttpClient, rootUrl: string, params: Update_1$Params, context?: HttpContext): Observable<StrictHttpResponse<Ride>> {
  const rb = new RequestBuilder(rootUrl, update_1.PATH, 'put');
  if (params) {
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');
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

update_1.PATH = '/rides/{id}';
