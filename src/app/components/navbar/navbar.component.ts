import { AuthService } from '@/api/services/auth.service';
import { AlertService } from '@/core/services/alert.service';
import { CartService } from '@/core/services/cart.service';
import { LayoutService } from '@/core/services/layout.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  #layoutService = inject(LayoutService);
  #userService = inject(AuthService);
  #cartService = inject(CartService);
  #router = inject(Router);
  #alerService = inject(AlertService);

  public user = this.#userService.user;

  public toogle() {
    this.#layoutService.toogle();
  }

  public handleCloseSession() {
    const cashActive = this.#cartService.cashRegisterActive();

    if (cashActive) {
      this.#alerService.showAlertWarning('Cierra primejo tu caja');
      return;
    }

    this.#userService.cerrarSession();
    this.#router.navigateByUrl('/auth/login');
  }
}
