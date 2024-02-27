import { HistoryProductPrice } from '@/api/interfaces/products.interface';
import { ProductService } from '@/api/services/product.service';
import { TableComponent } from '@/components/table/table.component';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, inject, signal } from '@angular/core';

@Component({
  selector: 'app-product-history',
  standalone: true,
  imports: [DialogLayout,TableComponent, DatePipe],
  template: `
      <dialog-layout title="History Product" (onClose)="closeDialog()">
        <app-table [header]="header">
          @for (product of productHistory(); track $index) {
            <tr class="hover:bg-gray-100 transition-all">
              <td
              class="sticky inset-y-0 start-0 bg-white whitespace-nowrap px-4 py-2 font-medium text-gray-900"
              >
                {{ $index + 1 }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                {{ product.name }}
              </td>
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                {{ product.oldPrice }}
              </td>
             
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                {{ product.date | date  }}
              </td>
            <tr>
          }
        </app-table>
      </dialog-layout>

  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductHistoryComponent implements OnInit {
  #productService = inject(ProductService)
  public header:string[] = ["Id","Nombre","Precio Antiguo","Fecha"]

  public productHistory = signal<HistoryProductPrice[]>([])

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: {id:number},
  ) {
  }

  ngOnInit(): void {
    this.#productService.getHistoryProductPrice(this.data.id).subscribe (resp => {
      this.productHistory.set(resp)
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

}