import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../Services/User/user.service';
import { SharedService } from '../../../Services/User/share.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  userLoginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  constructor(private router: Router, private userService: UserService,    
    private sharedService: SharedService 
  ) {
    this.userLoginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        ),
      ]),
    });
  }

  get email() {
    return this.userLoginForm.get('email');
  }

  get password() {
    return this.userLoginForm.get('password');
  }

  loginHandler() {
    if (this.userLoginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.userService.postUserLogin(this.userLoginForm.value).subscribe({
      next: (response) => {
        const userEmail = this.userLoginForm.value.email;
        this.sharedService.setEmail(userEmail);        
        if (response.status === 1 && response.accessToken) {
          try {
            // Store token with Bearer prefix
            localStorage.setItem('authToken', `Bearer ${response.accessToken}`);

            // Store only necessary user data
            const safeUserData = {
              id: response.user.id,
              name: response.user.userName,
              email: response.user.email,
            };
            // localStorage.setItem('user', JSON.stringify(safeUserData));
            // localStorage.setItem('authToken', response.accessToken);

            this.userLoginForm.reset();
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/']);
              });
          } catch (storageError) {
            console.error('Storage error:', storageError);
            this.errorMessage = 'Could not save your session';
          }
        } else {
          this.errorMessage =
            response.message || 'Login failed. Please check your credentials.';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = this.getErrorMessage(error);
        this.isLoading = false;
      },
      // Removed complete() since we handle loading state in next/error
    });
  }

  private getErrorMessage(error: any): string {
    if (!error) return 'An unknown error occurred';

    if (error.status === 401) {
      return 'Invalid email or password';
    }
    if (error.status === 0) {
      return 'Network error. Please check your internet connection.';
    }
    if (error.status >= 500) {
      return 'Server error. Please try again later.';
    }
    return error.error?.message || 'Login failed. Please try again.';
  }
}
