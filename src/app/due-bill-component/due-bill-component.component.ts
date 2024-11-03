import { Component, inject, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { HttpClient } from '@angular/common/http';
import { DueBill } from '../DueBillInfo';
import { CommonModule } from '@angular/common';
import { BillDetailService } from '../bill-detail.service';
import { RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedBillsService } from './Service/shared-bills.service';

@Component({
  selector: 'app-due-bill-component',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './due-bill-component.component.html',
  styleUrl: './due-bill-component.component.css',
})
export class DueBillComponentComponent implements OnInit {
  http = inject(HttpClient);
  loading: boolean = true;
  constructor(
    private auth: AuthServiceService,
    private cusID: BillDetailService,
    private router: Router,
    private sharedBillsService: SharedBillsService
  ) {}
  UID: number | null = null;

  dueBills: DueBill[] = [];
  ngOnInit(): void {
    const uId = this.auth.getUserId();
    this.UID = this.auth.getUserId();
    if (this.UID === null) {
      this.router.navigate(['/login']);
    }
    if (uId !== null) {
      this.http
        .get<DueBill[]>('http://localhost:8080/due/user', {
          params: { userId: uId.toString() },
          responseType: 'json',
        })
        .subscribe({
          next: (bills) => {
            this.dueBills = bills;
            this.loading = false;
            console.log(this.dueBills);
          },
          error: (error) => {
            console.error('Error fetching due bills: ', error);
          },
        });
    } else {
      console.error('Error: User ID is null. Cannot fetch due bills.');
    }
  }
  payBill(billId: any) {
    const customerId = 'someCustomerId';
    this.cusID.setCustomerId(billId);

    this.router.navigate(['/bill-pay']);
  }

  toggleBillSelection(bill: any) {
    bill.selected = !bill.selected; 
  }
  toggleSelectAll(event: Event) {
    const target = event.target as HTMLInputElement;
    const checked = target.checked;
    this.dueBills.forEach((bill) => (bill.selected = checked));
  }

  sendSelectedBills() {
    const selectedBills = this.dueBills.filter((bill) => bill.selected);
    this.sharedBillsService.setSelectedBills(selectedBills);

    this.router.navigate(['/bulk-pay']);
  }

  resetBills() {
    this.sharedBillsService.resetSelectedBills();
  }
}
