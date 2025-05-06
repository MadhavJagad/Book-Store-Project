import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AuthResponse,
  GetUser,
  LoginUser,
  RegisterUser,
} from '../../Interfaces/User/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'http://localhost:4000/api/store/book';

  constructor(private http: HttpClient) {}

  postUserRegister(user: RegisterUser): Observable<{ user: RegisterUser }> {
    return this.http.post<{ user: RegisterUser }>(`${this.url}/register`, user);
  }

  postUserLogin(credentials: LoginUser): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, credentials);
  }

  getUserData(email: any): Observable<GetUser> {
    const token = localStorage.getItem('authToken');
    const headers = token
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : undefined;

    const body = { email };

    return this.http.post<GetUser>(`${this.url}/list`, body, { headers });
  }
}
