import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletServiceService {
  private baseUrl = 'http://localhost:8080/wallet';

  constructor(private http: HttpClient) {}

  getWalletDetails(userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId);

    return this.http.get(`${this.baseUrl}`, { params });
  }

  sendOtpBank(body: any): Observable<any> {
    return this.http.post('http://localhost:8080/payment/bank', body, {
      responseType: 'text',
    });
  }

  sendOtpUPi(upi: any): Observable<any> {
    return this.http.post('http://localhost:8080/payment/verify-upi', null, {
      params: { upiId: upi + '' },
      responseType: 'text',
    });
  }

  makeRecharge(
    acc1: string,
    userId1: number,
    amount1: number,
    upiId1: string
  ): Observable<any> {
    // Determine which parameter to send based on the payment method
    let body = { acc: acc1, userId: userId1, amount: amount1, upiId: upiId1 };

    return this.http.post('http://localhost:8080/wallet/create-wallet', body, {
      responseType: 'text',
    });
  }

  verifyOtp(otp: string) {
    const params = new HttpParams().set('otp', otp);
    return this.http.get('http://localhost:8080/payment/otp', {
      params,
      responseType: 'text',
    });
  }
}
