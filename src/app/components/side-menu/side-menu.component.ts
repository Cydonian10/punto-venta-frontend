import { LayoutService } from '@/core/services/layout.service';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AuthService } from '@/api/services/auth.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [NgClass, RouterLink, CdkAccordionModule, RouterLinkActive],
  templateUrl: './side-menu.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  #layoutService = inject(LayoutService);
  public user = inject(AuthService).user;

  public open = this.#layoutService.open;
  public expandedIndex = 0;

  public items: any[] = [
    { name: 'Dashboard', link: '/admin', icon: 'bx bxs-dashboard' },
    { name: 'Usuarios', link: '/admin/users', icon: 'bx bxs-user' },
    { name: 'Clientes', link: '/admin/customers', icon: 'bx bxs-user' },
    { name: 'Empleados', link: '/admin/employees', icon: 'bx bxs-user' },
    { name: 'Compras', link: '/admin/purchases', icon: 'bx bx-store-alt' },
    { name: 'Ventas', link: '/admin/sales', icon: 'bx bx-book-open' },
    { name: 'Proveedores', link: '/admin/suppliers', icon: 'bx bx-book-open' },
    {
      name: 'Cajas Registradoras',
      link: '/admin/cash-register',
      icon: 'bx bx-book-open',
    },
  ];

  public pruba = [
    {
      title: 'Articulos',
      icon: 'bx bxl-product-hunt',
      links: [
        {
          name: 'Productos',
          link: '/admin/products',
          icon: 'bx bxl-product-hunt',
        },
        {
          name: 'Categorias',

          link: '/admin/categories',
          icon: 'bx bxl-product-hunt',
        },
        { name: 'Unit', link: '/admin/unit', icon: 'bx bxl-product-hunt' },
        { name: 'QRCode', link: '/admin/qr-code', icon: 'bx bxl-product-hunt' },
      ],
    },
  ];

  toogle() {
    this.#layoutService.toogle();
  }
}
