import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../Services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../../../Toaster/toaster.service';

@Component({
  selector: 'app-email-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './email-page.component.html',
  styleUrl: './email-page.component.scss',
})
export class EmailPageComponent {
  forgotPasswordForm: FormGroup;
  showOtpForm: boolean = false;
  emailCheck: string = '';
  otpSent = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: UserService,
    private router: Router,
    private toastService: ToasterService
  ) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      otp: new FormControl('', [Validators.required]),
    });
  }

  get email() {
    return this.forgotPasswordForm.get('email');
  }
  get otp() {
    return this.forgotPasswordForm.get('otp');
  }

  sendOtp() {
    if (this.forgotPasswordForm.get('email')?.invalid) {
      this.errorMessage = 'Please enter a valid email';
      return;
    }

    this.emailCheck = this.forgotPasswordForm.value.email;
    this.authService.sendOtp(this.emailCheck).subscribe({
      next: () => {
        this.otpSent = true;
        this.showOtpForm = true;
        this.successMessage = 'OTP sent to your email!';
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to send OTP';
      },
    });
  }

  verifyOtp() {
    if (this.forgotPasswordForm.get('otp')?.invalid) {
      this.errorMessage = 'Please enter the OTP';
      return;
    }

    const otp = this.forgotPasswordForm.value.otp;
    this.authService.verifyOtp(this.emailCheck, otp).subscribe({
      next: () => {
        this.toastService.show('OTP match successfully!', 'success');
        this.router.navigate(['/forget-password/password'], {
          queryParams: { email: this.emailCheck },
        });
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid OTP';
        console.error('Invalid OTP:', err);
      },
    });
  }
}
