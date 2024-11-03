import { Component, inject, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { BillDetailService } from '../bill-detail.service';
import { HttpClient } from '@angular/common/http';
import { DueBill } from '../DueBillInfo';
import { CommonModule } from '@angular/common';
import { ElementRef } from '@angular/core';

import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bill-payment-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './bill-payment-component.component.html',
  styleUrls: ['./bill-payment-component.component.css'],
})
export class BillPaymentComponentComponent implements OnInit {
  http = inject(HttpClient);

  dueBills: DueBill[] = [];
  Payment: FormGroup;
  UPIDetails: FormGroup;
  AccountDetails: FormGroup;
  paymentStatus: string = '';
  paymentStatusType = '';
  selectedPaymentMethod: string = '';
  totalAfterDiscount: number = 0;
  NoAccount = false;
  NoUpi = false;
  loading = true;
  billloading = true;
  discountPercentage = 10;

  constructor(
    private auth: AuthServiceService,
    private custId: BillDetailService,
    private el: ElementRef,
    private router: Router
  ) {
    this.AccountDetails = new FormGroup({
      acc_num: new FormControl('', [Validators.required]),
      cvv: new FormControl('', [Validators.required]),
      expiryMonth: new FormControl('', [Validators.required]),
      expiryYear: new FormControl('', [Validators.required]),
      bank: new FormControl(''), // for UPI selection
    });

    this.Payment = new FormGroup({
      Otp: new FormControl('', [Validators.required]),
    });

    this.UPIDetails = new FormGroup({
      upiId: new FormControl('', [Validators.required]),
    });
  }

  uId: any;
  cId: any;
  isVerified: boolean = false;
  isVerifying: boolean = false;
  isPaying: boolean = false;
  verifyError: boolean = false;

  formatAccountNumber(event: any) {
    const input = event.target.value.replace(/\D/g, '').match(/.{1,4}/g);
    if (input) {
      this.AccountDetails.patchValue({ acc_num: input.join('-') });
    } else {
      this.AccountDetails.patchValue({ acc_num: '' });
    }
  }

  ngOnInit() {
    this.uId = this.auth.getUserId();
    this.cId = this.custId.getCustomerId();
    console.log(this.cId);

    this.http
      .get<DueBill[]>('http://localhost:8080/due/amt', {
        params: { cus_id: this.cId.toString() },
        responseType: 'json',
      })
      .subscribe({
        next: (bills) => {
          this.dueBills = bills;
          if (this.dueBills.length > 0) {
            console.log('Amount Due:', this.dueBills[0].amt);
            this.billloading = false;
          } else {
            this.router.navigate(['/pay-bill']);
          }
        },
        error: (error) => {
          console.error('Error fetching due bills: ', error);
        },
      });

    this.years = this.generateYears();
  }

  months = [
    { label: 'January', value: '01' },
    { label: 'February', value: '02' },
    { label: 'March', value: '03' },
    { label: 'April', value: '04' },
    { label: 'May', value: '05' },
    { label: 'June', value: '06' },
    { label: 'July', value: '07' },
    { label: 'August', value: '08' },
    { label: 'September', value: '09' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ];

  years: number[] = [];

  selectedMonth: string = '';
  selectedYear: string = '';

  generateYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear + i);
    }
    return years;
  }

  selectPaymentMethod(method: string) {
    this.makeFieldsEditable();
    this.selectedPaymentMethod = method;
    this.isVerified = false; // Reset verification when changing payment method
    this.NoAccount = false;
    this.NoUpi = false;
    this.verifyError = false;
    this.paymentStatus = ''; // Reset payment status
    if (method === 'Wallet') {
      this.getWalletDTO();
    } else {
      this.Payment.reset();
      this.UPIDetails.reset();
      this.AccountDetails.reset(); // Optionally reset account details when switching to non-Wallet
    }
  }

  verifybank() {
    this.NoAccount = false;
    this.verifyError = false;
    this.isVerifying = true; // Start verifying
    this.makeFieldsReadOnly();

    let acc = this.AccountDetails.get('acc_num')?.value;
    const cvv = this.AccountDetails.get('cvv')?.value;
    const expiryMonth = this.AccountDetails.get('expiryMonth')?.value;
    const expiryYear = this.AccountDetails.get('expiryYear')?.value;

    if (!acc || !cvv || !expiryMonth || !expiryYear) {
      console.error('All fields are required');
      this.isVerifying = false;
      this.verifyError = true;
      this.makeFieldsEditable();
      return;
    }

    const formattedExpDate: string = `${expiryMonth}/${expiryYear
      .toString()
      .slice(-2)}`;
    acc = acc.replace(/-/g, '');
    let body = {
      accId: acc,
      cvv: cvv,
      exp: formattedExpDate,
    };

    console.log(body);
    this.http
      .post('http://localhost:8080/payment/bank', body, {
        responseType: 'text',
      })
      .subscribe({
        next: (response) => {
          console.log('Bank Details verification successful:', response);
          if (response === 'Success') {
            this.isVerified = true;
            this.NoAccount = false;
          } else {
            this.makeFieldsEditable();
            this.isVerified = false;
            this.NoAccount = true;
          }
          this.isVerifying = false; // Stop verifying
        },
        error: (error) => {
          console.error('Bank Details verification failed:', error);
          this.isVerified = false;
          this.NoAccount = false;
          this.isVerifying = false; // Stop verifying
          this.verifyError = true;
          this.makeFieldsEditable();
        },
        complete: () => console.log('Verification complete'),
      });
    console.log(this.isVerified);
  }

  verifyUpi() {
    this.NoUpi = false;
    this.verifyError = false;
    this.isVerifying = true; // Start verifying

    const upiId = this.UPIDetails.get('upiId')?.value;
    console.log('heelo');
    if (!upiId) {
      console.error('UPI ID is required');
      this.isVerifying = false;
      this.verifyError = true;
      return;
    }
    this.makeFieldsReadOnly();
    this.http
      .post('http://localhost:8080/payment/verify-upi', null, {
        params: { upiId: upiId },
        responseType: 'text',
      })
      .subscribe({
        next: (response) => {
          console.log('UPI verification successful:', response);
          if (response !== 'Error') {
            this.isVerified = true;
            this.NoUpi = false;
          } else {
            this.NoUpi = true;
            this.makeFieldsEditable();
          }
          this.isVerifying = false; // Stop verifying
        },
        error: (error) => {
          console.error('UPI verification failed:', error);
          this.isVerified = false;
          this.NoUpi = true;
          this.isVerifying = false; // Stop verifying
          this.verifyError = true;
          this.makeFieldsEditable();
        },
        complete: () => console.log('UPI Verification complete'),
      });
  }

  makePayment() {
    this.isPaying = true; // Start payment
    const transaction = {
      accountNumber:
        this.selectedPaymentMethod === 'Credit/Debit'
          ? this.AccountDetails.get('acc_num')?.value
          : null,
      upiId: null,
      userId: this.uId,
      cid: this.cId,
      customer_id: this.dueBills[0]?.customerId,
    };
    if (transaction.accountNumber) {
      transaction.accountNumber = transaction.accountNumber.replace(/-/g, '');
    }

    console.log(transaction);
    this.http
      .post('http://localhost:8080/payment/bank-pay', transaction, {
        params: { o: this.Payment.get('Otp')?.value },
        responseType: 'text',
      })
      .subscribe({
        next: (response) => {
          console.log('Payment successful:', response);
          this.paymentStatus = 'Payment Successful!';
          this.paymentStatusType = 'success';
          this.router.navigate(['/result'], {
            queryParams: { ref: response },
          });
        },
        error: (error) => {
          console.error('Payment failed:', error);
          this.paymentStatus = 'Payment Failed. Please try again.';
          this.paymentStatusType = 'error';
        },
        complete: () => {
          this.isPaying = false; // Stop payment
        },
      });
  }

  makeUpiPayment() {
    this.isPaying = true; // Start payment

    const transaction = {
      accountNumber: null,
      upiId: this.UPIDetails.get('upiId')?.value,
      userId: this.uId,
      cid: this.cId,
      customer_id: this.dueBills[0]?.customerId,
    };
    console.log(transaction);
    this.http
      .post('http://localhost:8080/payment/upi-pay', transaction, {
        params: {
          o: this.Payment.get('Otp')?.value,
        },
        responseType: 'text',
      })
      .subscribe({
        next: (response: any) => {
          console.log('UPI PAYMENT');
          console.log('Payment successful:', response);
          this.paymentStatus = 'Payment Successful!';
          this.paymentStatusType = 'success';
          this.router.navigate(['/result'], {
            queryParams: { ref: response },
          });
        },
        error: (error) => {
          console.error('Payment failed:', error);
          this.paymentStatus = 'Payment Failed. Please try again.';
          this.paymentStatusType = 'error';
        },
        complete: () => {
          this.isPaying = false; // Stop payment
        },
      });
  }
  walletPay = false;
  makePaymentWallet() {
    this.isPaying = true; // Start payment
    console.log('Fetching wallet amount');
    const userId = this.auth.getUserId();
    this.walletPay = true;

    if (userId !== null) {
      this.http
        .get('http://localhost:8080/wallet/pay-wallet', {
          params: { UID: userId, id: this.dueBills[0].id },
          responseType: 'text',
        })
        .subscribe({
          next: (response: any) => {
            console.log('====================================');
            console.log(response);
            console.log('====================================');
            this.paymentStatus = 'Payment Successful!';
            this.paymentStatusType = 'success';
            this.router.navigate(['/result'], {
              queryParams: { ref: response },
            });
          },
          error: (error) => {
            console.error('Error fetching wallet amount:', error);
            this.paymentStatus = 'Payment Failed. Please try again.';
            this.paymentStatusType = 'error';
          },
          complete: () => {
            this.isPaying = false;
          },
        });
    } else {
      this.router.navigate(['/login']);
    }
  }

  walletAmount: number | null = null;
  dueAmount: number = this.dueBills[0]?.amt || 0;

  getWalletDTO() {
    console.log('Fetching wallet amount');
    const userId = this.auth.getUserId();
    if (userId !== null) {
      this.http
        .get('http://localhost:8080/wallet/get-amount', {
          params: { UID: userId },
          responseType: 'text',
        })
        .subscribe({
          next: (response: any) => {
            this.walletAmount = parseInt(response, 10); // assuming API returns amount as text
            console.log('Wallet Amount:', this.walletAmount);
            console.log('====================================');
            console.log(this.walletAmount + ' ' + this.dueAmount);
            console.log('====================================');

            if (
              this.walletAmount !== null &&
              this.walletAmount < this.dueBills[0].amt &&
              this.walletAmount !== -1
            ) {
              console.log('Insufficient wallet balance');
            } else if (this.walletAmount === -1) {
              console.log('Wallet needs to be recharged');
            } else {
              console.log('Wallet balance is sufficient');
            }
          },
          error: (error) => {
            console.error('Error fetching wallet amount:', error);
          },
          complete: () => {
            this.loading = false;
          },
        });
    } else {
      this.router.navigate(['/login']);
    }
  }

  rechargeWallet() {
    console.log('Redirecting to wallet recharge page...');
    this.router.navigate(['/wallet']);
  }

  makeFieldsReadOnly() {
    this.AccountDetails.disable();
    this.UPIDetails.disable();
  }

  makeFieldsEditable() {
    this.AccountDetails.enable();
    this.UPIDetails.enable();
    // Re-enable OTP form
  }

  calculateTotal(): number {
    const billAmount = this.dueBills[0].amt;
    const discount = (this.discountPercentage / 100) * billAmount;
    return billAmount - discount;
  }
}
