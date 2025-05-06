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
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../Services/User/user.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  userRegisterForm: FormGroup;
  isSubmitting: boolean = false;

  constructor(private registerUser: UserService, private router: Router) {
    this.userRegisterForm = new FormGroup(
      {
        userName: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[^@]+@[^@]+.[^@]+$'),
        ]),
        phone: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        zipcode: new FormControl('', [
          Validators.required,
          Validators.maxLength(5),
        ]),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
      },
      { validators: this.passwordMatchValidator }
    );
  }

  get userName() {
    return this.userRegisterForm.get('userName');
  }
  get email() {
    return this.userRegisterForm.get('email');
  }
  get phone() {
    return this.userRegisterForm.get('phone');
  }
  get address() {
    return this.userRegisterForm.get('address');
  }
  get city() {
    return this.userRegisterForm.get('city');
  }
  get state() {
    return this.userRegisterForm.get('state');
  }
  get zipcode() {
    return this.userRegisterForm.get('zipcode');
  }
  get password() {
    return this.userRegisterForm.get('password');
  }
  get confirmPassword() {
    return this.userRegisterForm.get('confirmPassword');
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

  onSubmit() {
    this.isSubmitting = true;
    const userData = this.userRegisterForm.value;
    this.registerUser.postUserRegister(userData).subscribe({
      next: (response) => {
        alert('Registration successful!');
        this.userRegisterForm.reset();
        this.router.navigate(['/signin']);
      },
      error: (error) => {
        this.isSubmitting = false;
        alert('Registration failed. Please try again.');
        console.error('Registration error:', error);
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  // onSubmit() {

  //   this.isSubmitting = true;

  //   // Send ALL form data including confirmPassword
  //   const userData = this.userRegisterForm.value;

  //   this.userService.registerUser(userData).subscribe({
  //     next: (response) => {
  //       this.toastr.success('Registration successful!');
  //       this.userRegisterForm.reset();
  //       this.router.navigate(['/login']);
  //     },
  //     error: (error) => {
  //       this.isSubmitting = false;
  //       if (error.status === 409) {
  //         this.toastr.error('Email or username already exists');
  //       } else if (error.status === 400) {
  //         // Handle API validation errors
  //         if (error.error?.errors?.ConfirmPassword) {
  //           this.toastr.error(error.error.errors.ConfirmPassword[0]);
  //         } else {
  //           this.toastr.error('Invalid data format');
  //         }
  //       } else {
  //         this.toastr.error('Registration failed. Please try again.');
  //         console.error('Registration error:', error);
  //       }
  //     },
  //     complete: () => {
  //       this.isSubmitting = false;
  //     }
  //   });
  // }
}
