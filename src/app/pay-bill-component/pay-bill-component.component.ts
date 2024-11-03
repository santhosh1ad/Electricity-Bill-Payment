import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { PayBillInfo } from './PayInfo';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ServicesService } from './Services/services.service';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { BillDetailService } from '../bill-detail.service';

@Component({
  selector: 'app-pay-bill-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './pay-bill-component.component.html',
  styleUrls: ['./pay-bill-component.component.css'],
})
export class PayBillComponentComponent implements OnInit {
  states: string[] = ['Tamil Nadu', 'Mumbai'];
  http = inject(HttpClient);

  PayBill: FormGroup;
  Showamt: boolean = false;
  ShowName: boolean = false;
  isError: boolean = false;
  showDetails: boolean = false;
  username: string | null = null;
  notFound: boolean = false;
  Pay: boolean = false;

  UID: any;

  constructor(
    private service: ServicesService,
    private auth: AuthServiceService,
    private route: Router,
    private cdr: ChangeDetectorRef,
    private bill: BillDetailService
  ) {
    this.PayBill = new FormGroup({
      customer_Id: new FormControl('', [Validators.required]),
    });
  }
  GetbillDetails: PayBillInfo[] = [];
  payEarlyOffer: boolean = false;
  ngOnInit(): void {
    this.username = this.auth.getUsername();
    this.UID = this.auth.getUserId();
    if (this.UID === null) {
      this.route.navigate(['/login']);
    }

    this.PayBill.get('customer_Id')?.valueChanges.subscribe((value) => {
      this.showDetails = false;
      this.isError = false;
      console.log('Customer ID changed:', value);

      this.onCustomerIdChange(value);
    });
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  getInfo() {
    const customerId = this.PayBill.get('customer_Id')?.value;
    this.service.getBillDetails(customerId).subscribe({
      next: (data: PayBillInfo[]) => {
        this.GetbillDetails = data.map((item) => ({
          amt: item.amt,
          billGeneratedDate: item.billGeneratedDate,
          customerId: item.customerId,
          dueDate: item.dueDate,
          id: item.id,
          user: {
            address: item.user.address,
            email: item.user.email,
            id: item.user.id,
            name: item.user.name,
          },
        }));
        if (this.GetbillDetails.length > 0) {
          this.Showamt = true;
          this.ShowName = true;
          this.Pay = true;
          this.showDetails = true;
          this.notFound = false;
          this.getDiscount();
        } else {
          this.notFound = true;
        }
      },
      error: (err) => {
        if (err.status === 404) {
          this.isError = true;
          this.ShowName = false;
          this.notFound = true;
          console.log('Customer not found: ' + err.error.message);
        } else {
          this.isError = true;
          console.error('Error fetching details:', err);
        }
      },

      complete: () => console.log('GetbillDetails ' + this.GetbillDetails[0]),
    });
  }

  redirect() {
    const customerId = this.GetbillDetails[0].id;
    this.bill.setCustomerId(customerId + '');

    this.route.navigate(['/bill-pay']);
  }
  onCustomerIdChange(customerId: string) {
    this.showDetails = false;
    this.Pay = false;
    this.GetbillDetails = [];
    this.getDiscount();
  }

  getDiscount() {
    if (this.GetbillDetails.length > 0) {
      const dueDate = new Date(this.GetbillDetails[0].dueDate);

      this.payEarlyOffer = dueDate.getTime() > Date.now();
    } else {
      this.payEarlyOffer = false;
    }
  }
}
