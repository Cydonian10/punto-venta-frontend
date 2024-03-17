import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { ItemCart } from '../interfaces/shopping-cart.interface';
import { LocalStorageService } from './local-storage.service';
import { User } from '@/api/interfaces/auth.interface';
import { CashRegisterDto } from '@/api/interfaces/cash-register.interface';
import { ProductDto } from '@/api/interfaces/products.interface';

@Injectable({ providedIn: 'root' })
export class CartService {
  #localStorageService = inject(LocalStorageService);

  private _shoppingCart = signal<ItemCart[]>([]);
  private _customerActive = signal<User | null>(null);

  shoppingCart = computed(() => this._shoppingCart());
  customerActive = computed(() => this._customerActive());

  constructor() {
    const listData = this.#localStorageService.get<ItemCart[]>('Products');
    const customerActive =
      this.#localStorageService.get<User>('CustomerActive');

    if (listData) {
      this._shoppingCart.set(listData);
    }

    if (customerActive) {
      this._customerActive.set(customerActive);
    }

    effect(() => {
      this.#localStorageService.save<ItemCart[]>(
        this._shoppingCart(),
        'Products',
      );
      this.#localStorageService.save<User | null>(
        this._customerActive(),
        'CustomerActive',
      );
    });
  }

  subTotal = computed(() =>
    this._shoppingCart().reduce(
      (acc, item) => acc + item.quantity * item.unitPrice * 0.82,
      0,
    ),
  );
  igv = computed(() =>
    this._shoppingCart().reduce(
      (acc, item) => acc + item.quantity * item.unitPrice * 0.18,
      0,
    ),
  );
  total = computed(() =>
    this._shoppingCart().reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0,
    ),
  );

  addOneProduct(product: ProductDto, quantity: number) {
    const item: ItemCart = {
      quantity,
      productId: product.id,
      name: product.name,
      unitPrice: product.salePrice,
      discount: 0,
      subTotal: product.salePrice * quantity,
      unidad: product.unitMeasurement.symbol,
    };

    const itemCart = this._shoppingCart().some(
      (x) => x.productId === item.productId,
    );

    if (itemCart) {
      this._shoppingCart.update((x) =>
        x.map((y) => {
          if (y.productId === item.productId) {
            y.quantity += 1;
            y.subTotal += item.subTotal;
          }
          return y;
        }),
      );
    } else {
      this._shoppingCart.update((x) => [{ ...item, quantity: 1 }, ...x]);
    }
  }

  addProducts(item: ItemCart) {
    //const itemCart = this._shoppingCart().filter( x => x.productId === item.productId )
    const itemCart = this._shoppingCart().some(
      (x) => x.productId === item.productId,
    );

    if (itemCart) {
      this._shoppingCart.update((x) =>
        x.map((y) => {
          if (y.productId === item.productId) {
            y.quantity = item.quantity;
            y.subTotal = y.quantity * y.unitPrice;
          }
          return y;
        }),
      );
    } else {
      this._shoppingCart.update((x) => [item, ...x]);
    }
  }

  clearShopping() {
    this._shoppingCart.set([]);
  }

  removeProduct(item: ItemCart) {
    this._shoppingCart.update((x) =>
      x.filter((x) => x.productId !== item.productId),
    );
  }

  activeCustomer(user: User | null) {
    this._customerActive.set(user);
  }

  clearSale() {
    this._shoppingCart.set([]);
    this._customerActive.set(null);
  }
}
