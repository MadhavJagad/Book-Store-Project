import { UserPassword } from './../Interfaces/User';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, AuthResponse } from '../Interfaces/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  // Register a new user
  userRegister(userData: User): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, userData)
      .pipe(
        tap((response) => {
          if (response.token) {
            this.storeToken(response.token);
          }
        })
      );
  }

  // Log in an existing user
  userLogin(credentials: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          if (response.token) {
            this.storeToken(response.token);
          }
        })
      );
  }

  // Log out the user
  userDelete(userId: string, token: string): Observable<User> {
    const headers = { Authorization: `Bearer ${token}` };

    return this.http
      .delete<User>(`${this.baseUrl}/logout/${userId}`, { headers })
      .pipe(
        tap(() => {
          this.clearAuthData();
        })
      );
  }

  // Store token in local storage
  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Clear token from local storage
  clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
  }

  // Check if the user is logged in (i.e., token exists)
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  //Forget password
  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forget-password`, { email });
  }

  //Verify OTP
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp`, { email, otp });
  }

  //Reset password
  resetPassword(
    email: string,
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, {
      email,
      newPassword,
      confirmPassword,
    });
  }

  // Get user details
  getUserData() {
    const token = this.getToken();
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      return this.http.get<User>(`${this.baseUrl}/getuser`, { headers });
    } else {
      return null;
    }
  }

  //Update the Password | Change the Password
  updateUserPassword(password: UserPassword): Observable<UserPassword> {
    const token = this.getToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<UserPassword>(
      `${this.baseUrl}/update-password`,
      password,
      {
        headers,
      }
    );
    // .pipe(
    //   catchError((error) => {
    //     console.error('Password update error:', error);
    //     return throwError(() => new Error('Failed to update password'));
    //   })
    // );
  }
}
