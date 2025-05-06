import { CommonModule } from '@angular/common';
import { UserService } from './../../../Services/user.service';
import { Component } from '@angular/core';
import {
  Form,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from '../../../Toaster/toaster.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting: boolean = false;
  constructor(
    private authService: UserService,
    private router: Router,
    private toastService: ToasterService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        ),
      ]),
      userType: new FormControl('buyer', [Validators.required]),
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get userType() {
    return this.loginForm.get('userType');
  }

  submitHandler(): void {
    if (this.loginForm.valid) {
      this.authService.userLogin(this.loginForm.value).subscribe({
        next: (response) => {
          console.log(response);
          const userType = this.loginForm.value.userType;
          localStorage.setItem('userType', userType); // ⬅️ Store user type
          this.toastService.show('Login successful!', 'success');
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.toastService.show('User not exist', 'error');
          console.error(
            'Invalid credentials. Please try again.',
            error.error.message
          );
        },
      });
    }
  }
}
