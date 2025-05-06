import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private emailSubject = new BehaviorSubject<string | null>(null);
  email$ = this.emailSubject.asObservable(); // Expose email as observable

  constructor() {
    this.restoreSession(); // Restore session on service initialization
  }

  setEmail(email: string) {
    this.emailSubject.next(email)
;
    sessionStorage.setItem('userEmail', email); // Store temporarily in session
  }

  getEmail(): string | null {
    return this.emailSubject.value;
  }

  restoreSession() {
    const storedEmail = sessionStorage.getItem('userEmail');
    if (storedEmail) {
      this.emailSubject.next(storedEmail);
    }
  }

  logout() {
    this.emailSubject.next(null);
    sessionStorage.removeItem('userEmail');
    localStorage.removeItem('authToken'); // Remove token from local storage
  }
}