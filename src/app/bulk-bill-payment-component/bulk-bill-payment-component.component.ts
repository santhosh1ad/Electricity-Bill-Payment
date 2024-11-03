import { Component } from '@angular/core';
import { SharedBillsService } from '../due-bill-component/Service/shared-bills.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayRecord } from './PaymentRecord';
import { BulkserviceService } from './service/bulkservice.service';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bulk-bill-payment-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-bill-payment-component.component.html',
  styleUrl: './bulk-bill-payment-component.component.css',
})
export class BulkBillPaymentComponentComponent {
  selectedBills: any[] = [];
  enablePay = false;
  selectedBillId: number | null = null; // Holds the selected bill ID from the dropdown
  selectedBillDetails: any = null;

  customerName: string = '';

  constructor(
    private sharedBillsService: SharedBillsService,
    private paymentService: BulkserviceService,
    private http: HttpClient,
    private auth: AuthServiceService,
    private route: Router
  ) {}
  UPI: string = '';
  ngOnInit() {
    if (this.auth.getUserId() === null) {
      this.route.navigate(['/login']);
    }
    this.sharedBillsService.selectedBills$.subscribe((bills) => {
      this.selectedBills = bills;
      console.log('Selected Bills:', this.selectedBills);
    });
    console.log('hello');

    this.customerName = this.auth.getUsername()!;
  }

  displayBillDetails() {
    if (this.selectedBillId !== null) {
      this.selectedBillDetails = this.selectedBills.find(
        (bill) => bill.id === this.selectedBillId
      );
    }
  }

  verifyUpi() {
    const paymentRecords: PayRecord[] = this.selectedBills.map((bill) => {
      return new PayRecord(this.UPI, bill.user.id, bill.id, bill.customerId);
    });
    this.isLoading = true;

    this.http
      .post('http://localhost:8080/payment/verify-upi', null, {
        params: { upiId: this.UPI },
        responseType: 'text',
      })
      .subscribe({
        next: (response) => {
          console.log('UPI verification successful:', response);

          this.isUpiVerified = true;
          // Start loader

          this.isLoading = false;
        },
        error: () => {},
      });
  }
  OTP: string = '';
  isUpiVerified: boolean = false;
  isLoading: boolean = false;
  verifyOtp() {
    console.log('====================================');
    console.log('helooo');
    console.log('====================================');
    this.http
      .get('http://localhost:4200/payment/otp', {
        params: { otp: this.OTP },
        responseType: 'text',
      })
      .subscribe({
        next: (response) => {
          console.log('OTP Verification Response:', response);
          this.enablePay = true;
        },
        error: (error) => {
          console.error('OTP Verification Error:', error);
        },
      });
  }

  discountPercentage = 0;
  totalAmount: number = 10;
  paymentProcessing = false;
  makeBulkPayment() {
    const paymentRecords: PayRecord[] = this.selectedBills.map((bill) => {
      return new PayRecord(this.UPI, bill.user.id, bill.id, bill.customerId);
    });
    this.paymentProcessing = true;

    this.paymentService.processBulkPayments(paymentRecords).subscribe({
      next: (response) => {
        console.log('Payments processed successfully:', response);
        this.resetBills();
        this.paymentProcessing = false;
        this.route.navigate(['/transaction']);
      },
      error: (error) => {
        console.error('Error processing payments:', error);
      },
    });
    console.log(paymentRecords);
  }
  resetBills() {
    this.sharedBillsService.resetSelectedBills();
  }
  selectedBill: any = null;

  selectBill(bill: any) {
    this.discountPercentage = new Date() < bill.dueDate ? 5 : 10;
    this.totalAmount = Number(bill.amt * (100 - this.discountPercentage));

    this.selectedBill = bill;
  }

  deselectBill() {
    this.selectedBill = null; // Clear the selected bill
  }
}
