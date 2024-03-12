import { ProductDto } from '@/api/interfaces/products.interface';
import { ProductService } from '@/api/services/product.service';
import { InputComponent } from '@/components/input/input.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { ItemCart } from '@/core/interfaces/shopping-cart.interface';
import { CartService } from '@/core/services/cart.service';
import { Dialog } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, switchMap } from 'rxjs';
import { SelecUserComponent } from './components/select-user.component';
import { CreateSaleDto, StatusCompra } from '@/api/interfaces/sale.interface';
import { SaleService } from '@/api/services/sale.service';
import { AlertService } from '@/core/services/alert.service';
import { MisVentasComponent } from './components/mis-ventas.component';
import { ProductQuantityComponent } from '@/components/product-quantity/product-quantity.component';
import { NewUserComponent } from './components/new-user.component';
import { AuthService } from '@/api/services/auth.service';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [
    InputComponent,
    TitleCasePipe,
    TitleCreateComponent,
    OverlayModule,
    ProductQuantityComponent,
  ],
  template: `
    <app-title-create
      title="Punto de Venta"
      buttonText="Ventas Realizadas"
      (onOpenDialog)="misVentas()"
    >
      <span
        class="block bg-teal-300 py-1 px-3 md:py-2.5 text-sm md:text-base md:px-5 rounded-md border-teal-400 text-gray-800 font-bold"
        >{{ cashRegisterActive()?.name | titlecase }}</span
      >
      <button
        class="btn py-1 px-3 md:py-2.5 text-sm md:text-base md:px-5 btn-danger"
        (click)="limpiarSale()"
      >
        Limpiar
      </button>
    </app-title-create>

    <div class="entrada lg:flex lg:items-start">
      <section class="w-full lg:w-4/12 print:hidden">
        @if (cashRegisterActive()) {
          <app-input
            label="Buscador"
            placeholder="Nombre del producto"
            [control]="nameProduct"
          />
          <div class="flex gap-3 mt-2">
            <button
              (click)="selectUser()"
              class="btn-ghost ghost-primary py-1 px-3"
            >
              Usuario
            </button>
            <button (click)="newUser()" class="btn-ghost ghost-dark py-1 px-3">
              Nuevo Usuario
            </button>
          </div>

          <div class="mt-4 flex flex-col gap-1">
            @for (product of products(); track product.id) {
              <app-product-quantity
                [product]="product"
                (onActiveInput)="activeInput($event)"
                (onAddProduct)="agregarProduct($event)"
              />
            }
          </div>
        }
      </section>

      <!-- Seccion de  Cash -->
      <section class="lg:w-8/12 mt-5 lg:mt-0 ">
        <div class="mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-4">
          <div class="mx-auto max-w-5xl">
            <header class="flex items-center justify-center">
              <h1
                class="text-xl font-semibold text-gray-900 sm:text-3xl flex gap-5 items-center"
              >
                <span class="block">Cliente: </span>
                @if (customerActive()) {
                  <span
                    class="block text-sm bg-indigo-300 px-4 py-2 rounded-md border-indigo-500 border-2 text-gray-700 font-bold"
                    >{{ customerActive()?.email | titlecase }}</span
                  >
                }
              </h1>
            </header>

            <div class="mt-8">
              <ul class="space-y-4">
                @for (itemCart of shoppingCart(); track $index) {
                  <li class="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80"
                      alt=""
                      class="size-16 rounded object-cover"
                    />

                    <div>
                      <h3 class="text-sm text-gray-900">{{ itemCart.name }}</h3>

                      <dl class="mt-0.5 space-y-px text-[10px] text-gray-600">
                        <div>
                          <dt class="inline">Precio:</dt>
                          <dd class="inline">{{ itemCart.unitPrice }}</dd>
                        </div>

                        <div>
                          <dt class="inline">Color:</dt>
                          <dd class="inline">White</dd>
                        </div>
                      </dl>
                    </div>

                    <div class="flex flex-1 items-center justify-end gap-2">
                      <form>
                        <label for="Line1Qty" class="sr-only"> Quantity </label>

                        <input
                          type="number"
                          min="1"
                          [value]="itemCart.quantity"
                          id="Line1Qty"
                          class="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </form>

                      <button
                        (click)="removeProduct(itemCart)"
                        class="text-gray-600 transition hover:text-red-600"
                      >
                        <i class="bx bx-trash"></i>
                      </button>
                    </div>
                  </li>
                }
              </ul>

              @if (shoppingCart().length > 0) {
                <div
                  class="mt-8 flex justify-end border-t border-gray-100 pt-8"
                >
                  <div class="w-screen max-w-lg space-y-4">
                    <dl class="space-y-0.5 text-sm text-gray-700">
                      <div class="flex justify-between">
                        <dt>Subtotal</dt>
                        <dd>S/ {{ subTotal().toFixed(2) }}</dd>
                      </div>

                      <div class="flex justify-between">
                        <dt>IGV 18%</dt>
                        <dd>S/ {{ igv().toFixed(2) }}</dd>
                      </div>

                      <div class="flex justify-between">
                        <dt>Discount</dt>
                        <dd>-£20</dd>
                      </div>

                      <div class="flex justify-between !text-base font-medium">
                        <dt>Total</dt>
                        <dd>S/ {{ total().toFixed(2) }}</dd>
                      </div>
                    </dl>

                    <!-- <div class="flex justify-end">
                    <span
                      class="inline-flex items-center justify-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-indigo-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="-ms-1 me-1.5 h-4 w-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                        />
                      </svg>

                      <p class="whitespace-nowrap text-xs">
                        2 Discounts Applied
                      </p>
                    </span>
                  </div> -->

                    @if (cashRegisterActive()) {
                      <div class="flex justify-end gap-4">
                        <button
                          (click)="cotizacion()"
                          class="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                        >
                          Cotizar
                        </button>
                        <button
                          (click)="pagar()"
                          class="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                        >
                          Pagar
                        </button>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SalePage {
  #productService = inject(ProductService);
  #cartService = inject(CartService);
  #dialog = inject(Dialog);
  #saleService = inject(SaleService);
  #alertService = inject(AlertService);
  #authService = inject(AuthService);

  public nameProduct = new FormControl('', {
    validators: [],
  });
  public products = signal<ProductDto[]>([]);
  // public quantity = signal('');
  public statusCompra = signal<StatusCompra>(StatusCompra.debe);
  public shoppingCart = this.#cartService.shoppingCart;
  public subTotal = this.#cartService.subTotal;
  public igv = this.#cartService.igv;
  public total = this.#cartService.total;
  public customerActive = this.#cartService.customerActive;
  public cashRegisterActive = this.#cartService.cashRegisterActive;

  ngOnInit() {
    this.nameProduct.valueChanges
      .pipe(
        debounceTime(1000),
        filter((resp) => resp!.trim().length > 0),
        switchMap((resp) =>
          this.#productService.getFilter({
            name: resp,
            price: null,
            stock: null,
          }),
        ),
      )
      .subscribe((resp) => {
        this.products.set(resp);
      });
  }

  misVentas() {
    this.#dialog.open(MisVentasComponent, {
      width: '800px',
      backdropClass: 'bg-black/60',
      data: { titulo: 'Mis Ventas' },
      disableClose: true,
    });
  }

  agregarProduct(value: { dto: ProductDto; quantity: number }) {
    const cartItem: ItemCart = {
      quantity: value.quantity,
      productId: value.dto.id,
      name: value.dto.name,
      unitPrice: value.dto.salePrice,
      discount: 0,
    };
    this.#cartService.addProducts(cartItem);
  }

  activeInput(id: number) {
    this.products.update((x) =>
      x.map((x) => {
        x.inputActive = false;
        if (x.id == id) {
          x.inputActive = true;
        }
        return x;
      }),
    );
  }

  selectUser() {
    const dialogRef = this.#dialog.open(SelecUserComponent, {
      width: '600px',
      backdropClass: 'bg-black/60',
      disableClose: true,
    });

    dialogRef.closed.subscribe((resp: any) => {
      if (resp) {
        this.#cartService.activeCustomer(resp);
      }
    });
  }

  removeProduct(item: ItemCart) {
    this.#cartService.removeProduct(item);
  }

  cotizacion() {
    this.statusCompra.set(StatusCompra.cotizacion);
    const createSale: CreateSaleDto = {
      date: new Date(),
      customerId: this.customerActive()!.id,
      cashRegisterId: this.cashRegisterActive()!.id,
      taxex: 18,
      statusCompra: this.statusCompra(),
      saleDetails: this.shoppingCart(),
    };

    this.#saleService.downloadFile(createSale).subscribe((response: any) => {
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      this.#alertService.showAlertSuccess('Execel descargado');
    });
  }

  pagar() {
    this.statusCompra.set(StatusCompra.pagado);
    const createSale: CreateSaleDto = {
      date: new Date(),
      customerId: this.customerActive()!.id,
      cashRegisterId: this.cashRegisterActive()!.id,
      taxex: 18,
      statusCompra: this.statusCompra(),
      saleDetails: this.shoppingCart(),
    };

    this.#saleService.generateSale(createSale).subscribe({
      next: () => {
        this.#alertService.showAlertSuccess('Venta realizada');
        this.products.set([]);
      },
      error: (error) => {
        this.#alertService.showAlertError(error.error.error);
      },
    });
  }

  limpiarSale() {
    this.#cartService.clearSale();
  }

  newUser() {
    this.#dialog
      .open(NewUserComponent, {
        minWidth: '300px',
        width: '500px',
        backdropClass: 'bg-black/60',
        data: { titulo: 'Agregar Usuario' },
        disableClose: true,
      })
      .closed.subscribe((resp: any) => {
        if (resp) {
          this.#authService.registerUser(resp).subscribe((x) => {
            this.#alertService.showAlertSuccess('Usuario Creado');
          });
        }
      });
  }
}
