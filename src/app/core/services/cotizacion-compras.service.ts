import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ItemComprasCart } from '../interfaces/compras-cart.interface';
import { SupplierDto } from '@/api/interfaces/suppliers.interface';

@Injectable({ providedIn: 'root' })
export class CotizacionComprasService {
  #localStorageService = inject(LocalStorageService);

  #comprasCart = signal<ItemComprasCart[]>([]);
  #supplierActive = signal<SupplierDto | null>(null);

  public comprasCart = computed(() => this.#comprasCart());
  public supplierActive = computed(() => this.#supplierActive());

  constructor() {
    const listCompras =
      this.#localStorageService.get<ItemComprasCart[]>('Compras');

    const supplierActive =
      this.#localStorageService.get<SupplierDto>('SupplierActive');

    if (listCompras) {
      this.#comprasCart.set(listCompras);
    }

    if (supplierActive) {
      this.#supplierActive.set(supplierActive);
    }

    effect(() => {
      this.#localStorageService.save<ItemComprasCart[]>(
        this.#comprasCart(),
        'Compras'
      );

      this.#localStorageService.save<SupplierDto | null>(
        this.#supplierActive(),
        'SupplierActive'
      );
    });
  }

  total = computed(() =>
    this.#comprasCart().reduce(
      (acc, item) => acc + item.quantity * item.purchasePrice,
      0
    )
  );

  addProduct(item: ItemComprasCart) {
    const itemCart = this.#comprasCart().some(
      (x) => x.productId == item.productId
    );

    if (itemCart) {
      this.#comprasCart.update((x) =>
        x.map((y) => {
          if (y.productId == item.productId) {
            y.quantity = item.quantity;
          }
          return y;
        })
      );
    } else {
      this.#comprasCart.update((x) => [item, ...x]);
    }
  }

  clearComprasCart() {}

  removeProduct(item: ItemComprasCart) {
    this.#comprasCart.update((x) =>
      x.filter((x) => x.productId !== item.productId)
    );
  }

  handleActiveSupplier(dto: SupplierDto | null) {
    this.#supplierActive.set(dto);
  }
}
