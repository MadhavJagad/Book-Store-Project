import { Product } from './../Interfaces/product';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  baseUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  createBooks(bookData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/create-book`, bookData);
  }
  getAllBooks(): Observable<Product[]> {
    return this.http
      .get<{ data: Product[] }>(`${this.baseUrl}/books`)
      .pipe(map((res) => res.data));
  }
  getBookById(id: string): Observable<{ success: boolean; data: Product }> {
    console.log('Calling backend with book ID:', id);
    return this.http.get<{ success: boolean; data: Product }>(
      `${this.baseUrl}/book/${id}`
    );
  }
}
