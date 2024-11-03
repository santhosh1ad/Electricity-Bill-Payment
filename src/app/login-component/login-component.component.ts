import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthServiceService } from '../auth-service.service';
import { Router, RouterOutlet } from '@angular/router';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    RouterOutlet,
  ],
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css'],
})
export class LoginComponentComponent implements OnInit {
  LoginForms: FormGroup;
  http = inject(HttpClient);
  showOtp: boolean = false;
  isCusId: boolean = false;
  isErr: boolean = false;
  isLoading = false;

  showModal: boolean = true;

  isModalOpen = true;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    public dialog: MatDialog,
    private renderer: Renderer2
  ) {
    this.LoginForms = new FormGroup({
      customer_Id: new FormControl('', [Validators.required]),
      otp: new FormControl(),
    });
  }

  ngOnInit(): void {
    console.log('login');
    this.LoginForms.get('customer_Id')?.valueChanges.subscribe((value) => {
      this.showOtp = false;
      this.isErr = false;
      console.log('Customer ID changed:', value);
    });
  }

  getInfo() {
    const cus_Id = this.LoginForms.get('customer_Id')?.value;
    this.isLoading = true; // Start loading when request is sent
    this.http
      .post('http://localhost:8080/login/generate-otp', null, {
        params: { id: cus_Id },
        responseType: 'text',
      })
      .subscribe({
        next: () => {
          this.showOtp = true;
          this.isCusId = false;
          this.isLoading = false; // Stop loading after success
        },
        error: () => {
          this.isCusId = true;
          this.isLoading = false; // Stop loading if an error occurs
        },
      });
  }

  validateOtp() {
    const o = this.LoginForms.get('otp')?.value;
    this.isLoading = true; // Start loading when request is sent
    this.http
      .post('http://localhost:8080/login/validate-otp', null, {
        params: { otp: o },
        responseType: 'json',
      })
      .subscribe({
        next: (res: any) => {
          this.authService.setUserId(res.id);
          this.authService.setUsername(res.uname);
          this.isLoading = false; // Stop loading after success
          this.router.navigate(['/due-bill']);
        },
        error: () => {
          this.isErr = true;
          this.isLoading = false; // Stop loading if an error occurs
        },
      });
  }

  onSubmit() {
    if (this.LoginForms.valid) {
      if (this.showOtp) {
        this.validateOtp();
      } else {
        this.getInfo();
      }
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.renderer.removeClass(document.body, 'modal-open'); // Enable scroll
  }
}
