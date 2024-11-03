import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Transaction } from './TransactionDTO';
import { CommonModule } from '@angular/common';
import { ServiceService } from './Result_service/service.service';

@Component({
  selector: 'app-result-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-component.component.html',
  styleUrl: './result-component.component.css',
})
export class ResultComponentComponent implements OnInit {
  uId: number | null = null;
  transaction: Transaction[] = [];
  refId: string | null = null;
  constructor(
    private http: HttpClient,
    private auth: AuthServiceService,
    private route: ActivatedRoute,
    private receiptService: ServiceService,
    private router: Router
  ) {}

  loading = true;

  ngOnInit(): void {
    this.uId = this.auth.getUserId();

    //this.UID = this.auth.getUserId();
    if (this.uId === null) {
      this.router.navigate(['/login']);
    }
    console.log('User ID:', this.uId);

    if (this.uId) {
      this.route.queryParamMap.subscribe((params) => {
        this.refId = params.get('ref');
        console.log('Ref ID:', this.refId);

        if (this.refId) {
          this.fetchTransaction(this.uId!, this.refId);
        } else {
          console.error('Error: Reference ID is null.');
        }
      });
    } else {
      console.error('Error: User ID is null.');
    }
  }

  fetchTransaction(uId: number, refId: string) {
    console.log('inside method');
    this.http
      .get<Transaction[]>('http://localhost:8080/trans/byRefId', {
        params: { userId: uId.toString(), refId: refId },
        responseType: 'json',
      })
      .subscribe({
        next: (res) => {
          this.transaction = res;
          console.log(res);
          setTimeout(() => {
            this.loading = false;
          }, 2000);
        },
        error: (error) => {
          console.error('Error fetching transaction: ', error);
        },
      });
  }

  downloadPdf() {
    if (this.refId !== null) {
      this.receiptService
        .downloadReceipt(this.refId)
        .subscribe((response: Blob) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = 'receipt.pdf';
          a.click();

          window.URL.revokeObjectURL(url);
        });
    }
  }

  redirect() {
    this.router.navigate(['/pay-bill']);
  }
}
