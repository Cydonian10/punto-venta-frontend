import { ProductDto } from '@/api/interfaces/products.interface';
import { ProductService } from '@/api/services/product.service';
import { InputComponent } from '@/components/input/input.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { ItemCart } from '@/core/interfaces/shopping-cart.interface';
import { CartService } from '@/core/services/cart.service';
import { Dialog } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, delay, filter, switchMap, tap } from 'rxjs';
import { SelecUserComponent } from './components/select-user.component';
import { CreateSaleDto, StatusCompra } from '@/api/interfaces/sale.interface';
import { SaleService } from '@/api/services/sale.service';
import { AlertService } from '@/core/services/alert.service';
import { MisVentasComponent } from './components/mis-ventas.component';
import { ProductQuantityComponent } from '@/components/product-quantity/product-quantity.component';
import { NewUserComponent } from './components/new-user.component';
import { AuthService } from '@/api/services/auth.service';
import { SaleItemsComponent } from './components/sale-items.component';
import { CompanyInfoComponent } from './components/company-info.component';
import { CashRegisterService } from '@/api/services/cash-register.service';
import { CashRegisterActiveComponent } from './components/cash-register-active.component';
import { CashRegisterDto } from '@/api/interfaces/cash-register.interface';
import { CashRegisterStore } from '@/core/store/cash-register.store';
import { UserStore } from '@/core/store/user.store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [
    InputComponent,
    TitleCasePipe,
    TitleCreateComponent,
    OverlayModule,
    ProductQuantityComponent,
    NgClass,
    DatePipe,
    SaleItemsComponent,
    CompanyInfoComponent,
    CashRegisterActiveComponent,
  ],
  template: `
    <app-title-create
      title="Punto de Venta"
      buttonText="Ventas Realizadas"
      (onOpenDialog)="misVentas()"
    >
      <span
        class="block bg-teal-300 py-1 px-3 md:py-2.5 text-sm md:text-base md:px-5 rounded-md border-teal-400 text-gray-800 font-bold"
        >{{ cashRegisterState().currentCashRegister?.name | titlecase }}</span
      >

      <cash-register-active
        (onSelectCashRegister)="handleSelectCashRegister($event)"
        (onCloseCashRegister)="handleCloseCashRegiser($event)"
        [user]="user()!"
        [cashRegisters]="cashRegisterState().listCashRegister"
      />

      <button
        class="btn py-1 px-3 md:py-2.5 text-sm md:text-base md:px-5 btn-danger"
        (click)="limpiarSale()"
      >
        Limpiar
      </button>
    </app-title-create>

    <div class="entrada lg:flex lg:items-start gap-10">
      <section class="w-full lg:w-4/12 print:hidden">
        @if (cashRegisterState().currentCashRegister) {
          <div class="flex gap-2">
            <div
              [ngClass]="{ 'bg-amber-500': selectTypeSearch() === 'qr' }"
              (click)="handleSelectTypeSearch('qr')"
              class=" px-3 py-1.5 rounded-md border text-salate-600 font-bold cursor-pointer"
            >
              QRCode
            </div>
            <div
              [ngClass]="{ 'bg-amber-500': selectTypeSearch() === 'name' }"
              (click)="handleSelectTypeSearch('name')"
              class="border px-3 py-1.5 rounded-md text-slate-600 font-bold cursor-pointer"
            >
              Nombre
            </div>
          </div>
          @if (selectTypeSearch() === 'name') {
            <app-input
              label="Buscador nombre"
              placeholder="Nombre del producto"
              [control]="nameProduct"
            />
          } @else {
            <app-input
              label="Buscador con codigo qr"
              placeholder="Codigo QR"
              type="number"
              [control]="qrProduct"
            />
          }

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
        } @else {
          <p>Activar primero una caja</p>
        }
      </section>
      <section class="lg:w-7/12">
        <company-info [cliente]="customerActive()!">
          <app-sale-items
            [shoppintCart]="shoppingCart()"
            [subTotal]="subTotal()"
            [igv]="igv()"
            [total]="total()"
            (onDeleteItem)="removeProduct($event)"
            (onPagarShopping)="pagar()"
          />
        </company-info>
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
  #userStore = inject(UserStore);
  #router = inject(Router);

  public nameProduct = new FormControl('', {
    validators: [],
  });

  public qrProduct = new FormControl<number | null>(null, {
    validators: [],
  });
  public products = signal<ProductDto[]>([]);
  public user = this.#authService.user;
  public statusCompra = signal<StatusCompra>(StatusCompra.debe);
  public shoppingCart = this.#cartService.shoppingCart;
  public subTotal = this.#cartService.subTotal;
  public igv = this.#cartService.igv;
  public total = this.#cartService.total;
  public customerActive = this.#cartService.customerActive;
  public selectTypeSearch = signal<'qr' | 'name'>('qr');
  public cashRegisters = signal<CashRegisterDto[]>([]);

  #cashRegisterStore = inject(CashRegisterStore);

  public cashRegisterState = this.#cashRegisterStore.state;

  ngOnInit() {
    this.searchByName();
    this.searchByQrProduct();
    this.#userStore.getCustomers();
  }

  private searchByName() {
    this.nameProduct.valueChanges
      .pipe(
        debounceTime(1000),
        filter((resp) => resp!.trim().length > 0),
        switchMap((resp) =>
          this.#productService.getFilter({
            name: resp,
            price: null,
            stock: null,
            barCode: null,
          }),
        ),
      )
      .subscribe((resp) => {
        this.products.set(resp);
        this.#cartService.addOneProduct(resp[0], 1);
        this.nameProduct.reset('');
        this.qrProduct.reset(0);
      });
  }

  private searchByQrProduct() {
    this.qrProduct.valueChanges
      .pipe(
        debounceTime(300),
        filter((resp) => resp! > 0),
        switchMap((resp) =>
          this.#productService.getFilter({
            name: null,
            price: null,
            stock: null,
            barCode: resp,
          }),
        ),
      )
      .subscribe((resp) => {
        if (resp.length === 0) {
          this.#alertService.showAlertWarning('No hay producto');
          this.qrProduct.reset(null);
          return;
        }
        this.products.set(resp);
        this.#cartService.addOneProduct(resp[0], 1);
        this.nameProduct.reset('');
        this.qrProduct.reset(null);
      });
  }

  misVentas() {
    // this.#dialog.open(MisVentasComponent, {
    //   width: '800px',
    //   backdropClass: 'bg-black/60',
    //   data: { titulo: 'Mis Ventas' },
    //   disableClose: true,
    // });
    this.#router.navigateByUrl('/admin/sales/mis-ventas');
  }

  agregarProduct(value: { dto: ProductDto; quantity: number }) {
    const cartItem: ItemCart = {
      quantity: value.quantity,
      productId: value.dto.id,
      name: value.dto.name,
      unitPrice: value.dto.salePrice,
      discount: 0,
      subTotal: value.quantity * value.dto.salePrice,
      unidad: value.dto.unitMeasurement.symbol,
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
      cashRegisterId: this.cashRegisterState().currentCashRegister!.id,
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
    if (this.customerActive()?.id === undefined) {
      this.#alertService.showAlertError('Necesita Un Usuario');
      return;
    }

    this.statusCompra.set(StatusCompra.pagado);

    const createSale: CreateSaleDto = {
      date: new Date(),
      customerId: this.customerActive()!.id,
      cashRegisterId: this.cashRegisterState().currentCashRegister!.id,
      taxex: 18,
      statusCompra: this.statusCompra(),
      saleDetails: this.shoppingCart(),
    };

    this.#saleService.generateSale(createSale).subscribe({
      next: () => {
        this.#cashRegisterStore.updateTotalCashBeforePago(
          this.#cartService.total(),
        );
        window.print();
        this.limpiarSale();
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
        width: '500px',
        backdropClass: 'bg-black/60',
        data: { titulo: 'Agregar Usuario' },
        disableClose: true,
      })
      .closed.subscribe((resp: any) => {
        if (resp) {
          this.#userStore.createCustomer(resp);
        }
      });
  }

  handleSelectTypeSearch(value: 'qr' | 'name') {
    this.selectTypeSearch.set(value);
    this.nameProduct.reset('');
    this.qrProduct.reset(null);
  }

  handleSelectCashRegister(value: CashRegisterDto) {
    const userId = this.#authService.user()?.usuario.id;
    this.#cashRegisterStore.activeRegisterCashWithUser(userId!, value.id);
    this.#cashRegisterStore.selectCurrectCashRegister(value);
  }

  handleCloseCashRegiser(id: number) {
    this.#cashRegisterStore.closeCashRegister(id);
  }
}
