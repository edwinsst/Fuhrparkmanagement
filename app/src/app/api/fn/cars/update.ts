/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Car } from '../../models/car';

export interface Update$Params {
  id: number;
      body: Car
}

export function update(http: HttpClient, rootUrl: string, params: Update$Params, context?: HttpContext): Observable<StrictHttpResponse<Car>> {
  const rb = new RequestBuilder(rootUrl, update.PATH, 'put');
  if (params) {
    rb.path('id', params.id, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Car>;
    })
  );
}

update.PATH = '/cars/{id}';
