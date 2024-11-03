import { Component } from '@angular/core';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { PayBillComponentComponent } from './pay-bill-component/pay-bill-component.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from './auth-service.service';
import { BillPaymentComponentComponent } from './bill-payment-component/bill-payment-component.component';
import { BillDetailService } from './bill-detail.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, LoginComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
  constructor(
    private auth: AuthServiceService,
    private bill: BillDetailService,
    private route: Router
  ) {}

  confirmLogout() {
    if (window.confirm('Are you sure you want to log out?')) {
      this.logout();
    }
  }

  logout() {
    this.auth.clearAll();
    this.bill.clearAll();
    // Optionally navigate to the login page or home page
    this.route.navigate(['/login']); // Redirect after logout
  }
}
