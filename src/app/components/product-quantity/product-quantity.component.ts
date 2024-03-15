import { ProductDto } from '@/api/interfaces/products.interface';
import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-product-quantity',
  standalone: true,
  imports: [TitleCasePipe],
  template: `
    <div
      class="p-4 shadow-lg rounded-lg border border-slate-300 flex items-center justify-between"
    >
      <div class="flex flex-col">
        <span class="font-bold">{{ product.name | titlecase }}</span>
        <span class="text-[12px] font-semibold text-gray-600">
          S/ {{ product.salePrice }} el {{ product.unitMeasurement.name }}
        </span>
        <span class="text-[12px] font-semibold text-gray-600"
          >{{ product.stock }} {{ product.unitMeasurement.name }}</span
        >
      </div>
      <div class="flex gap-2">
        @if (!product.inputActive) {
          <button
            class="btn-ghost ghost-secondary"
            (click)="activeInput(product.id)"
          >
            Activar
          </button>
        } @else {
          <input
            type="number"
            min="1"
            value="1"
            #quantityField
            [value]="quantity()"
            (input)="quantity.set(quantityField.value)"
            class="h-8 w-12 outline outline-gray-300 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 
              [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none  focus:outline-indigo-500"
          />
          <button
            (click)="agregarProduct(product)"
            class="btn-ghost ghost-dark  py-1 px-2 "
          >
            Agregar
          </button>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class ProductQuantityComponent {
  @Input() product!: ProductDto;

  @Output() onActiveInput = new EventEmitter();
  @Output() onAddProduct = new EventEmitter();

  public quantity = signal('');

  activeInput(id: number) {
    this.onActiveInput.emit(id);
  }

  agregarProduct(dto: ProductDto) {
    if (parseFloat(this.quantity()) <= 0 || this.quantity().length == 0) {
      return;
    }
    this.onAddProduct.emit({ dto, quantity: parseFloat(this.quantity()) });
  }
}
