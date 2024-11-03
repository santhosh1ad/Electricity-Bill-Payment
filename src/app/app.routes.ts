import { Routes } from '@angular/router';
import { LoginComponentComponent } from './login-component/login-component.component';
import { PayBillComponentComponent } from './pay-bill-component/pay-bill-component.component';
import { AppComponent } from './app.component';
import { DueBillComponentComponent } from './due-bill-component/due-bill-component.component';
import { BillPaymentComponentComponent } from './bill-payment-component/bill-payment-component.component';
import { TransactionComponentComponent } from './transaction-component/transaction-component.component';
import { ResultComponentComponent } from './result-component/result-component.component';
import { WalletComponentComponent } from './wallet-component/wallet-component.component';
import { BulkBillPaymentComponentComponent } from './bulk-bill-payment-component/bulk-bill-payment-component.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponentComponent },

  { path: 'pay-bill', component: PayBillComponentComponent },
  { path: 'due-bill', component: DueBillComponentComponent },
  { path: 'bill-pay', component: BillPaymentComponentComponent },
  { path: 'transaction', component: TransactionComponentComponent },
  { path: 'result', component: ResultComponentComponent },
  { path: 'wallet', component: WalletComponentComponent },
  { path: 'bulk-pay', component: BulkBillPaymentComponentComponent },
];
