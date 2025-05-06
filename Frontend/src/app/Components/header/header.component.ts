import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { UserService } from '../../Services/user.service';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../Toaster/toaster.service';
import { CartService } from '../../Services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  cartItems: any[] = [];
  constructor(
    private router: Router,
    private authService: UserService,
    private toastService: ToasterService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
    });

    this.cartService.loadCart(); // Load on init
  }
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

  logout() {
    this.authService.clearAuthData();
    this.toastService.show('Logout successful!', 'success');
    this.router.navigate(['/login']);
  }
}
