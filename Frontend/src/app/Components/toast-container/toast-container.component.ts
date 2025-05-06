import { Component } from '@angular/core';
import { ToasterService } from '../../Toaster/toaster.service';
import { Toast } from '../../Interfaces/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss',
})
export class ToastContainerComponent {
  toasts: Toast[] = [];

  constructor(private toastService: ToasterService) {}

  ngOnInit(): void {
    this.toastService.toasts$.subscribe((toasts) => {
      this.toasts = toasts;
    });
  }

  removeToast(id: number): void {
    this.toastService.remove(id);
  }
}
