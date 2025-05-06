import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = 'http://localhost:3000/api/cart';

  // Shared state for cart items
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient, private userService: UserService) {}

  private getHeaders(): HttpHeaders {
    const token = this.userService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Load cart from backend and update the subject
  loadCart(): void {
    this.http
      .get<any>(`${this.baseUrl}/get-cart`, {
        headers: this.getHeaders(),
      })
      .subscribe((res) => {
        console.log('Cart API response:', res);
        this.cartItemsSubject.next(res.cart.items); 
      });
  }

  addToCart(bookId: string, quantity: number = 1): Observable<any> {
    const headers = this.getHeaders();
    return this.http
      .post(`${this.baseUrl}/add-cart`, { bookId, quantity }, { headers })
      .pipe(
        tap(() => this.loadCart()) // Reload cart after adding
      );
  }

  getCart(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-cart`, {
      headers: this.getHeaders(),
    });
  }

  removeFromCart(bookId: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/remove-cart/${bookId}`, {
        headers: this.getHeaders(),
      })
      .pipe(tap(() => this.loadCart()));
  }

  updateCartItem(bookId: string, quantity: number): Observable<any> {
    return this.http
      .put(
        `${this.baseUrl}/update-cart/${bookId}`,
        { quantity },
        { headers: this.getHeaders() }
      )
      .pipe(tap(() => this.loadCart()));
  }

  clearCart(): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/clear-cart`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap(() => this.cartItemsSubject.next([])) // Clear local state too
      );
  }
}
