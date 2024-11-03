import { Component, OnInit } from '@angular/core';
import { TranactServiceService } from './tranact-service.service';
import { Transaction } from './TransactDetails';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transaction-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-component.component.html',
  styleUrl: './transaction-component.component.css',
})
export class TransactionComponentComponent implements OnInit {
  constructor(
    private TransService: TranactServiceService,
    private router: Router
  ) {}
  details: Transaction[] = [];
  paginatedTransactions: Transaction[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 7;
  totalPages: number = 0;
  loading: boolean = true;

  ngOnInit() {
    this.TransService.getTransAccDetails().subscribe({
      next: (data) => {
        console.log(data);
        this.loading = false;
        if (data !== null) {
          this.details = data.map((item) => ({
            id: item.id,
            amount: item.amount,
            status: item.status,
            transactionDate: new Date(item.transactionDate),
            customerId: item.customerId,
            customer: item.customer,
            mop: item.mop,
            referenceNumber: item.referenceNumber,
            user: {
              id: item.user.id,
              name: item.user.name,
              email: item.user.email,
              address: item.user.address,
            },
          }));

          this.totalPages = Math.ceil(this.details.length / this.itemsPerPage);
          this.paginateTransactions();
          console.log('Transaction details: ', this.details);
        }
      },
      error: (err) => {
        console.error('Error fetching transaction details:', err);
      },
      complete: () => {
        console.log('Transaction details fetched successfully.');
      },
    });
    this.details.sort(
      (a, b) => b.transactionDate.getTime() - a.transactionDate.getTime()
    );
  }

  paginateTransactions(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTransactions = this.details.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateTransactions();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateTransactions();
    }
  }
  redirectToTransaction(ref1: string) {
    this.router.navigate(['/result'], {
      queryParams: { ref: ref1 },
    });
  }

  filter = {
    customerId: '',
    status: '',
  };

  // Watch the filter values and update the filtered transactions
  ngOnChanges() {
    this.applyFilter();
  }
  filteredTransactions: Transaction[] = [];

  applyFilter() {
    this.filteredTransactions = this.paginatedTransactions.filter(
      (transaction) => {
        const matchesCustomerId = this.filter.customerId
          ? transaction.customerId.includes(this.filter.customerId)
          : true;
        const matchesStatus = this.filter.status
          ? transaction.status === this.filter.status
          : true;
        return matchesCustomerId && matchesStatus;
      }
    );
  }
}
