import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { WalletServiceService } from './Services/wallet-service.service';
import { Wallet } from './WalletDetails';
import { AuthServiceService } from '../auth-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wallet-component',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './wallet-component.component.html',
  styleUrls: ['./wallet-component.component.css'],
})
export class WalletComponentComponent implements OnInit {
  walletDetails: Wallet | undefined;
  noWallet: boolean = false;
  otp: string = '';
  UPIDetails: FormGroup;
  AccountDetails: FormGroup;
  balanceAmount: number = 0;
  showRechargeOptions = false;
  selectedPaymentMethod: string = '';
  submit: boolean = false;
  allowRecharge: boolean = false;
  rechargeAmount: number = 0;
  rechargeInitiated: boolean = false;
  isLoading: boolean = true;

  loading = true;

  goback = false;

  // New properties added
  isRechargeEnabled: boolean = false; // Controls if the submit button is enabled
  verifyBankClicked: boolean = false; // Controls if bank verification button is clicked
  verifyUpiClicked: boolean = false; // Controls if UPI verification button is clicked
  isRechargeAmountEditable: boolean = true; // Controls if the recharge amount input is editable

  constructor(
    private walletService: WalletServiceService,
    private auth: AuthServiceService
  ) {
    this.AccountDetails = new FormGroup({
      acc_num: new FormControl(''),
      cvv: new FormControl(''),
      expiryMonth: new FormControl(''),
      expiryYear: new FormControl(''),
    });

    this.UPIDetails = new FormGroup({
      upiId: new FormControl(''),
    });
  }

  ngOnInit() {
    this.fetchWalletDetails();
    this.loading = true;
  }

  fetchWalletDetails() {
    this.isLoading = true;
    this.rechargeInitiated = false;
    const userId = this.auth.getUserId();
    if (userId !== null) {
      this.walletService.getWalletDetails(userId).subscribe({
        next: (data: Wallet) => {
          if (data !== null) {
            this.balanceAmount = data.amount;
          }
          this.walletDetails = data;
          this.loading = false;
          this.isLoading = false;
        },
        error: () => {},
        complete: () => {
          if (this.walletDetails === undefined) {
            this.noWallet = true;
          }
        },
      });
    }
  }

  selectPaymentMethod(method: string) {
    this.selectedPaymentMethod = method;
    this.showRechargeOptions = false;
  }

  resetPayment() {
    this.selectedPaymentMethod = '';
    this.rechargeAmount = 0;
    this.showRechargeOptions = false;
    this.submit = false;
    this.allowRecharge = false;
    this.AccountDetails.reset();
    this.UPIDetails.reset();
    this.isRechargeAmountEditable = true; // Reset to editable
  }

  goBack() {
    this.resetPayment();
    this.showRechargeOptions = true;
  }

  cancel() {
    this.resetPayment();
    this.fetchWalletDetails();

    this.showRechargeOptions = true;
  }

  makeRecharge() {
    const userId = this.auth.getUserId();
    if (userId !== null) {
      const acc = this.AccountDetails.get('acc_num')?.value;
      const upi = this.UPIDetails.get('upiId')?.value;

      this.walletService
        .makeRecharge(acc, userId, this.rechargeAmount, upi)
        .subscribe({
          next: (response) => {
            console.log('Recharge successful:', response);

            this.fetchWalletDetails();
          },
          error: (err) => {
            console.error('Error occurred during recharge:', err);
          },
        });
    } else {
      console.log('User Not Found');
    }

    this.fetchWalletDetails();
    this.resetPayment();
  }

  verifyBank() {
    let acc = this.AccountDetails.get('acc_num')?.value;
    const cvv = this.AccountDetails.get('cvv')?.value;
    const expiryMonth = this.AccountDetails.get('expiryMonth')?.value;
    const expiryYear = this.AccountDetails.get('expiryYear')?.value;

    if (!acc || !cvv || !expiryMonth || !expiryYear) {
      console.error('All fields are required');
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

    this.walletService.sendOtpBank(body).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response !== 'Error') {
          this.submit = true;
          this.verifyBankClicked = true; // Hide button after verification
          this.isRechargeEnabled = true;
        } else {
          this.goback = true;
        } // Enable the recharge button after successful verification
      },
      error: () => {
        this.submit = false;
        this.isRechargeEnabled = false; // Disable if verification fails
      },
    });
  }

  verifyUpi() {
    const upiId = this.UPIDetails.get('upiId')?.value;
    if (!upiId) {
      console.error('UPI ID is required');
      return;
    }

    this.walletService.sendOtpUPi(upiId).subscribe({
      next: (response) => {
        console.log('UPI verification successful:', response);
        if (response !== 'Error') {
          this.submit = true;
          this.verifyUpiClicked = true; // Hide button after verification
          this.isRechargeEnabled = true; // Enable the recharge button after successful verification
        } else {
          this.goback = true;
        }
      },
      error: (error) => {
        console.error('UPI verification failed:', error);
        this.submit = false;
        this.isRechargeEnabled = false; // Disable if verification fails
      },
    });
  }

  verifyOtp() {
    console.log(this.otp);
    this.walletService.verifyOtp(this.otp).subscribe({
      next: (res) => {
        if (res === 'Correct') this.allowRecharge = true;
        
      
      },
      error: (err) => {
        console.log(err);
        this.allowRecharge = false;
      },
    });
  }

  initiateRecharge() {
    if (this.isValidRechargeAmount()) {
      this.rechargeInitiated = true; // Hide the recharge button
      this.showRechargeOptions = true;
      this.isRechargeAmountEditable = false; // Show options
    } else {
      alert('Please enter a valid positive amount.');
    }
  }

  isValidRechargeAmount(): boolean {
    return this.rechargeAmount !== null && this.rechargeAmount > 0;
  }
}
