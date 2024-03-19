import { TableComponent } from '@/components/table/table.component';
import { ItemCart } from '@/core/interfaces/shopping-cart.interface';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-sale-items',
  standalone: true,
  imports: [TableComponent],
  template: `
    @if (shoppintCart.length > 0) {
      <div class="flex flex-col w-full">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div class="overflow-hidden">
              <table
                class="min-w-full text-center text-sm font-light text-surface"
              >
                <thead
                  class="border-b border-neutral-200 font-medium text-slate-800 "
                >
                  <tr>
                    <th scope="col" class=" w-8 p-2">#</th>
                    <th
                      scope="col"
                      class=" p-2 w-[200px] md:w-[400px] text-left"
                    >
                      Producto
                    </th>
                    <th scope="col" class=" p-2">Precio</th>
                    <th scope="col" class=" p-2">Cantidad</th>
                    <th scope="col" class=" p-2">SubTotal</th>
                    <th scope="col" class=" p-2 print:hidden">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  @for (item of shoppintCart; track $index) {
                    <tr class="border-b border-neutral-200 ">
                      <td class="whitespace-nowrap w-8 p-2 font-medium">
                        {{ $index + 1 }}
                      </td>
                      <td
                        class="whitespace-nowrap p-2 w-[200px] md:w-[400px] text-left line-clamp-1"
                      >
                        {{ item.name }}
                      </td>
                      <td class="whitespace-nowrap  p-2">
                        {{ item.unitPrice }}
                      </td>
                      <td class="whitespace-nowrap  p-2">
                        {{ item.quantity }} {{ item.unidad }}
                      </td>
                      <td class="whitespace-nowrap  p-2">
                        {{ item.subTotal }}
                      </td>
                      <td class="whitespace-nowrap  p-2 print:hidden">
                        <button
                          (click)="handleDeleteItem(item)"
                          class="btn-icon btn-icon-danger p-1"
                        >
                          <i class="bx bx-trash"></i>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>

                <tfoot>
                  <tr class="font-semibold">
                    <td class="p-2 w-8"></td>
                    <td class="p-2"></td>
                    <td colspan="2" class="p-2 ">SubTotal</td>
                    <td class="p-2">{{ subTotal.toFixed(2) }}</td>
                    <td class="p-2 print:hidden"></td>
                  </tr>
                  <tr class="font-semibold">
                    <td class="p-2"></td>
                    <td class="p-2"></td>
                    <td colspan="2" class="p-2 ">IGV 18%</td>
                    <td class="p-2">{{ igv.toFixed(2) }}</td>
                    <td class="p-2 print:hidden"></td>
                  </tr>
                  <tr class="font-semibold">
                    <td class="p-2"></td>
                    <td class="p-2"></td>
                    <td colspan="2" class="p-2 ">Descuento</td>
                    <td class="p-2">0</td>
                    <td class="p-2 print:hidden"></td>
                  </tr>
                  <tr class="font-semibold">
                    <td class="p-2"></td>
                    <td class="p-2"></td>
                    <td colspan="2" class="p-2 ">Total</td>
                    <td class="p-2">{{ total.toFixed(2) }}</td>
                    <td class="p-2 print:hidden"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end print:hidden">
        <button (click)="handlePagarShopping()" class="btn-ghost ghost-primary">
          Pagar
        </button>
      </div>
    } @else {
      <span>No hay productos </span>
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleItemsComponent {
  @Input() shoppintCart: ItemCart[] = [];
  @Input() igv: number = 0;
  @Input() subTotal: number = 0;
  @Input() total: number = 0;

  @Output() onDeleteItem = new EventEmitter();
  @Output() onPagarShopping = new EventEmitter();

  handleDeleteItem(item: any) {
    this.onDeleteItem.emit(item);
  }

  handlePagarShopping() {
    this.onPagarShopping.emit();
  }
}
