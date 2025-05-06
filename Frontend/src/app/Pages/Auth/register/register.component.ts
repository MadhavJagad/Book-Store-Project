import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToasterService } from '../../../Toaster/toaster.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  userForm: FormGroup;
  isSubmitting: boolean = false;
  cities: String[] = ['Surat', 'Mumbai', 'Delhi', 'Kolkata', 'Pune'];

  constructor(
    private toastService: ToasterService,
    private authService: UserService,
    private router: Router
  ) {
    this.userForm = new FormGroup({
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
      state: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required, Validators.maxLength(5)]),
      city: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        ),
      ]),
    });
  }

  get userName() {
    return this.userForm.get('userName');
  }
  get email() {
    return this.userForm.get('email');
  }
  get phone() {
    return this.userForm.get('phone');
  }
  get address() {
    return this.userForm.get('address');
  }
  get state() {
    return this.userForm.get('state');
  }
  get zip() {
    return this.userForm.get('zip');
  }
  get city() {
    return this.userForm.get('city');
  }
  get password() {
    return this.userForm.get('password');
  }

  // submitHandler() {
  //   this.isSubmitting = true;
  //   const userData = this.userForm.value;
  //   this.userService.userRegistration(userData).subscribe({
  //     next: (response) => {
  //       this.userForm.reset();
  //       this.toastService.show('Registration successful!', 'success');
  //       this.router.navigate(['/login']);
  //     },
  //     error: (err) => {
  //       console.error('Error registering user:', err);
  //       this.toastService.show('Error registering user!', 'error');
  //       this.isSubmitting = false;
  //     },
  //     complete: () => {
  //       this.isSubmitting = false;
  //     },
  //   });
  // }
  submitHandler(): void {
    if (this.userForm.valid) {
      this.authService.userRegister(this.userForm.value).subscribe({
        next: () => {
          this.toastService.show('Registration successful!', 'success');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.toastService.show(
            'Registration failed. Please try again.',
            'error'
          );
          console.error(
            'Registration failed. Please try again.',
            error.error.message
          );
        },
      });
    }
  }
}
