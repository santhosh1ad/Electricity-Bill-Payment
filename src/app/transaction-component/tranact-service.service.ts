import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { BillDetailService } from '../bill-detail.service';
import { Transaction } from './TransactDetails';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TranactServiceService {
  http = inject(HttpClient);
  constructor(
    private auth: AuthServiceService,
    private bill: BillDetailService
  ) {}

  getTransAccDetails(): Observable<Transaction[]> {
    const userId = this.auth.getUserId();
    if (userId !== null && userId !== undefined) {
      return this.http.get<Transaction[]>('http://localhost:8080/trans', {
        params: { uid: userId.toString() },
        responseType: 'json',
      });
    } else {
      throw new Error('User ID is null or undefined.');
    }
  }
}
