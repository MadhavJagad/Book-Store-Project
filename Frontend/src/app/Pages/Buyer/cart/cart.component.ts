import { CartService } from './../../../Services/cart.service';
import { UserService } from './../../../Services/user.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToasterService } from '../../../Toaster/toaster.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  emptyMessage: boolean = false;

  constructor(
    public userService: UserService,
    private cartService: CartService,
    private toastr: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }
  loadCart() {
    if (this.userService.isLoggedIn()) {
      this.cartService.getCart().subscribe({
        next: (res: any) => {
          this.cartItems = res.cart?.items || [];
        },
        error: (err) => {
          console.error('Error loading cart:', err);
        },
      });
    }
  }

  removeFromCart(bookId: string) {
    this.cartService.removeFromCart(bookId).subscribe({
      next: () => {
        this.toastr.show('Item removed from cart', 'success');
        this.loadCart(); // Refresh cart
      },
      error: (err) => {
        this.toastr.show('Failed to remove item from cart', 'error');
        console.error('Error removing from cart:', err);
      },
    });
  }

  updateQuantity(bookId: string, newQuantity: number) {
    if (newQuantity < 1) {
      this.removeFromCart(bookId);
      return;
    }

    this.cartService.updateCartItem(bookId, newQuantity).subscribe({
      next: () => {
        this.loadCart(); // Refresh cart
      },
      error: (err) => {
        this.toastr.show('Failed to update quantity', 'error');
        console.error('Error updating quantity:', err);
      },
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.book.price * item.quantity;
    }, 0);
  }

  clearCart(){}
}
