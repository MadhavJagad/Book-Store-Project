import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../Services/User/user.service';
import { CommonModule } from '@angular/common';
import { GetUser } from '../../../Interfaces/User/user';
import { SharedService } from '../../../Services/User/share.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userData: GetUser | null = null;
  isLoading: boolean = true;
  error: string | null = null;
  userEmail: string | null = null;

  constructor(private userService: UserService, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.sharedService.email$.subscribe((email)=> {
         this.userEmail = email;
    });
    console.log(this.userEmail);
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserData(this.userEmail).subscribe({
      next: (data) => {
        this.userData = data;
        this.isLoading = false;
        console.log('User data loaded:', data); // Debug log
      },
      error: (err) => {
        this.error = 'Failed to load profile data';
        this.isLoading = false;
        console.error('Error loading profile:', err);
      },
    });
  }
}
