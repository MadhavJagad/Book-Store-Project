import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';
import { ToastContainerComponent } from './Components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ToastContainerComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
}
