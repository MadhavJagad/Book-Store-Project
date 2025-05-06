import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../../Services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasterService } from '../../../../Toaster/toaster.service';

@Component({
  selector: 'app-password-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './password-page.component.html',
  styleUrl: './password-page.component.scss',
})
export class PasswordPageComponent {
  changePasswordForm: FormGroup;
  getEmail: string = '';

  constructor(
    private authService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToasterService
  ) {
    this.changePasswordForm = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordMatchValidator }
    );
    // Get email from query param
    this.route.queryParams.subscribe((params) => {
      this.getEmail = params['email'];
    });
  }
  get email() {
    return this.changePasswordForm.get('email');
  }

  get password() {
    return this.changePasswordForm.get('password');
  }
  get confirmPassword() {
    return this.changePasswordForm.get('confirmPassword');
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  };

  resetPasswordHandler() {
    const { password, confirmPassword } = this.changePasswordForm.value;

    this.authService
      .resetPassword(this.getEmail, password, confirmPassword)
      .subscribe({
        next: (res) => {
          this.toastService.show('Password reset successfully!', 'success');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toastService.show(
            err.error.message || 'Failed to reset password',
            'error'
          );
        },
      });
  }
}
