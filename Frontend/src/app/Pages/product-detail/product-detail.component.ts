import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from './../../Services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from '../../Interfaces/product';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/user.service';
import { CartService } from '../../Services/cart.service';
import { ToasterService } from '../../Toaster/toaster.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  cartItems: any[] = [];
  relatedBooks: any[] = [];

  constructor(
    private ProductService: ProductService,
    public userService: UserService,
    private cartService: CartService,
    private toastr: ToasterService,
    private route: ActivatedRoute
  ) {}

  bookId!: string;
  book!: Product;

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchBookDetails();
    this.getAllBooks()
  }

  getAllBooks() {
    this.ProductService.getAllBooks().subscribe({
      next: (res) => {
        this.relatedBooks = res;
      },
      error: (err) => {
        console.error('Error fetching books:', err);
      },
    });
  }

  fetchBookDetails() {
    this.ProductService.getBookById(this.bookId).subscribe({
      next: (res) => {
        this.book = res.data;
      },
      error: (err) => {
        console.error('Error fetching book:', err);
      },
    });
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

  addToCart(bookId: string | undefined) {
    if (!bookId) {
      console.error('Book ID is undefined');
      return;
    }

    if (!this.userService.isLoggedIn()) {
      this.toastr.show('Item added to cart', 'success');
      return;
    }

    this.cartService.addToCart(bookId).subscribe({
      next: (res: any) => {
        this.toastr.show('Item added to cart', 'success');
        this.loadCart();
      },
      error: (err) => {
        this.toastr.show('Failed to add item to cart', 'error');
        console.error('Error adding to cart:', err);
      },
    });
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
}
