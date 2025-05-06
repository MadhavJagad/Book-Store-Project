import { UserService } from './../../Services/user.service';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToasterService } from '../../Toaster/toaster.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  userPasswordForm: FormGroup;

  constructor(
    private UserService: UserService,
    private toastService: ToasterService
  ) {
    this.userPasswordForm = new FormGroup({
      oldPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  get oldPassword() {
    return this.userPasswordForm.get('oldPassword');
  }
  get newPassword() {
    return this.userPasswordForm.get('newPassword');
  }
  get confirmPassword() {
    return this.userPasswordForm.get('confirmPassword');
  }

  updatePasswordHandler() {
    this.UserService.updateUserPassword(this.userPasswordForm.value).subscribe({
      next: () => {
        this.userPasswordForm.reset();
        this.toastService.show('Password Updated Successfuly', 'success');
      },
      error: (err) => {
        console.log(err);
        this.toastService.show('Failed to Update the Password', 'error');
      },
    });
  }
}
