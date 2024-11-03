import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { PayBillInfo } from '../PayInfo';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
  name: string = '';
  http = inject(HttpClient);
  constructor() {}

  getBillDetails(cus_Id: number): Observable<PayBillInfo[]> {
    return this.http.get<PayBillInfo[]>(
      'http://localhost:8080/paybill/getDetails',
      {
        params: {
          customer_Id: cus_Id,
        },
        responseType: 'json',
      }
    );
  }
}
