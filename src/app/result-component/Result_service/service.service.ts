import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(private http: HttpClient) {}
  downloadReceipt(transactionId1 : string) {
    return this.http.get('http://localhost:8080/api/receipt/download', {
      params:{transactionId : transactionId1},
      responseType: 'blob',
    });
  }
}
