import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './api/services/auth.service';
import { LocalStorageService } from './core/services/local-storage.service';
import { TokenService } from './core/services/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  #authService = inject(AuthService);
  #tokenService = inject(TokenService);

  ngOnInit() {
    const token = this.#tokenService.getToken();

    if (token) {
      this.#authService.profile().subscribe();
    }
  }
}
