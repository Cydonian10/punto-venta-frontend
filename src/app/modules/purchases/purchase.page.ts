import { ProductDto } from '@/api/interfaces/products.interface';
import { ProductService } from '@/api/services/product.service';
import { AppComponent } from '@/app.component';
import { InputComponent } from '@/components/input/input.component';
import { ProductQuantityComponent } from '@/components/product-quantity/product-quantity.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { ItemComprasCart } from '@/core/interfaces/compras-cart.interface';
import { CotizacionComprasService } from '@/core/services/cotizacion-compras.service';
import { Dialog } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, switchMap } from 'rxjs';
import { SelectSupplierComponent } from './list-supplier/select-supplier.component';
import { TitleCasePipe } from '@angular/common';
import { PurchaseCrearDto } from '@/api/interfaces/purchase.interface';
import { PurchaseService } from '@/api/services/purchase.service';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [
    TitleCreateComponent,
    ProductQuantityComponent,
    InputComponent,
    OverlayModule,
    TitleCasePipe,
  ],
  template: `
    <div class="entrada">
      <app-title-create
        title="Compras"
        buttonText="Compras Realizadas"
      ></app-title-create>

      <div class="entrada lg:flex lg:items-start">
        <section class="w-full lg:w-4/12 print:hidden">
          <app-input
            label="Buscador"
            placeholder="Nombre del producto"
            [control]="nameProduct"
          />
          <button
            (click)="selectSupplier()"
            class="btn-ghost ghost-primary py-1 px-3 mt-3"
          >
            Cliente
          </button>

          <div class="mt-4 flex flex-col gap-1">
            @for (product of products(); track product.id) {

            <app-product-quantity
              [product]="product"
              (onActiveInput)="activeInput($event)"
              (onAddProduct)="agregarProduct($event)"
            />
            }
          </div>
        </section>

        <!-- Seccion de  Cash -->
        <section class="lg:w-8/12 mt-5 lg:mt-0 ">
          <div class="mx-auto max-w-screen-2xl px-2 sm:px-6 lg:px-4">
            <div class="mx-auto max-w-5xl">
              <header class="flex items-center justify-center">
                <h1
                  class="text-xl font-semibold text-gray-900 sm:text-3xl flex gap-5 items-center"
                >
                  <span class="block">Proveedor: </span>
                  <span
                    class="block text-sm bg-indigo-300 px-4 py-2 rounded-md border-indigo-400 text-gray-800 font-bold"
                    >{{ supplierActive()?.name | titlecase }}</span
                  >
                </h1>
              </header>

              <div class="mt-8">
                <ul class="space-y-4">
                  @for (itemCart of comprasCart() ; track $index) {
                  <li class="flex items-center gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80"
                      alt=""
                      class="size-16 rounded object-cover"
                    />

                    <div>
                      <h3 class="text-sm text-gray-900">
                        {{ itemCart.productId }}
                      </h3>

                      <dl class="mt-0.5 space-y-px text-[10px] text-gray-600">
                        <div>
                          <dt class="inline">Precio:</dt>
                          <dd class="inline">{{ itemCart.purchasePrice }}</dd>
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

                @if(comprasCart().length > 0){
                <div
                  class="mt-8 flex justify-end border-t border-gray-100 pt-8"
                >
                  <div class="w-screen max-w-lg space-y-4">
                    <dl class="space-y-0.5 text-sm text-gray-700">
                      <div class="flex justify-between !text-base font-medium">
                        <dt>Total</dt>
                        <dd>S/ {{ total().toFixed(2) }}</dd>
                      </div>
                    </dl>

                    <div class="flex justify-end gap-4">
                      <button
                        class="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                      >
                        Cotizar
                      </button>
                      <button
                        (click)="handlePurchaseSubmit()"
                        class="block rounded bg-gray-700 px-5 py-3 text-sm text-gray-100 transition hover:bg-gray-600"
                      >
                        Pagar
                      </button>
                    </div>
                  </div>
                </div>
                }
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PurchasePage {
  #productService = inject(ProductService);
  #comprasCartService = inject(CotizacionComprasService);
  #dialog = inject(Dialog);
  #purchaseService = inject(PurchaseService);

  public products = signal<ProductDto[]>([]);
  public nameProduct = new FormControl('');
  public comprasCart = this.#comprasCartService.comprasCart;
  public total = this.#comprasCartService.total;
  public supplierActive = this.#comprasCartService.supplierActive;

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
          })
        )
      )
      .subscribe((resp) => {
        this.products.set(resp);
      });
  }

  agregarProduct(value: { dto: ProductDto; quantity: number }) {
    const dto: ItemComprasCart = {
      quantity: value.quantity,
      productId: value.dto.id,
      purchasePrice: value.dto.purchasePrice,
    };
    this.#comprasCartService.addProduct(dto);
  }

  activeInput(id: number) {
    this.products.update((x) =>
      x.map((x) => {
        x.inputActive = false;
        if (x.id == id) {
          x.inputActive = true;
        }
        return x;
      })
    );
  }

  removeProduct(item: ItemComprasCart) {
    this.#comprasCartService.removeProduct(item);
  }

  selectSupplier() {
    const dialogRef = this.#dialog.open(SelectSupplierComponent, {
      width: '100%',
      disableClose: true,
    });

    dialogRef.closed.subscribe((resp: any) => {
      this.#comprasCartService.handleActiveSupplier(resp);
    });
  }

  handlePurchaseSubmit() {
    const data: PurchaseCrearDto = {
      taxes: 18.0,
      date: new Date(),
      supplierId: this.supplierActive()!.id,
      details: this.comprasCart(),
    };

    this.#purchaseService.generatePurchase(data).subscribe((resp) => {
      console.log(resp);
    });
  }
}
