import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Services/user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToasterService } from '../../../Toaster/toaster.service';

@Component({
  selector: 'app-buyer-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './buyer-profile.component.html',
  styleUrl: './buyer-profile.component.scss',
})
export class BuyerProfileComponent implements OnInit {
  userData: any;
  userInput: boolean = false;
  constructor(
    private userService: UserService,
    private toastService: ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData() {
    const userDataObservable = this.userService.getUserData();
    if (userDataObservable) {
      userDataObservable.subscribe({
        next: (res) => {
          // console.log('User Data:', res);
          this.userData = res;
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        },
      });
    } else {
      console.error('Failed to retrieve user data: No token available.');
    }
  }

  editHandler() {
    
    this.userInput = !this.userInput;
  }

  logout() {
    this.userService.clearAuthData();
    this.toastService.show('Logout successful!', 'success');
    this.router.navigate(['/login']);
  }

  DeleteAccount(): void {
    const token = this.userService.getToken();

    if (token) {
      const userId = this.extractUserIdFromToken(token);

      if (userId) {
        this.userService.userDelete(userId, token).subscribe({
          next: () => {
            localStorage.removeItem('userType');
            this.toastService.show('User Deleted successful!', 'success');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Logout failed:', error);
          },
        });
      }
    }
  }

  extractUserIdFromToken(token: string): string | null {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      return decodedToken.id || null;
    } catch (error) {
      console.error('Error decoding token', error);
      return null;
    }
  }
}
