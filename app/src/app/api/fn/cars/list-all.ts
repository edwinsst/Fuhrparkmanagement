/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Car } from '../../models/car';

export interface ListAll$Params {
}

export function listAll(http: HttpClient, rootUrl: string, params?: ListAll$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<Car>>> {
  const rb = new RequestBuilder(rootUrl, listAll.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Car>>;
    })
  );
}

listAll.PATH = '/cars';
