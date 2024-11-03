import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PayRecord } from '../PaymentRecord';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BulkserviceService {
  private baseUrl = 'http://localhost:8080/payments';

  constructor(private http: HttpClient) {}

  processBulkPayments(paymentRecords: PayRecord[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/bulk`, paymentRecords);
  }
}
