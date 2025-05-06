import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast } from '../Interfaces/toast';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  private currentId = 0;
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  constructor() {}

  show(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'success',
    autohide = true,
    delay = 5000
  ): void {
    const toast: Toast = {
      id: this.currentId++,
      message,
      type,
      autohide,
      delay,
    };

    const toasts = [...this.toastsSubject.value, toast];
    this.toastsSubject.next(toasts);

    if (autohide) {
      setTimeout(() => this.remove(toast.id), delay);
    }
  }

  remove(id: number): void {
    const toasts = this.toastsSubject.value.filter((toast) => toast.id !== id);
    this.toastsSubject.next(toasts);
  }

  clear(): void {
    this.toastsSubject.next([]);
  }
}
