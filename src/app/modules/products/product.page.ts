import { ProductDto } from '@/api/interfaces/products.interface';
import { ProductService } from '@/api/services/product.service';
import { TableComponent } from '@/components/table/table.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';

import {Dialog, DialogModule} from "@angular/cdk/dialog"
import { ProductCrearFormComponent } from './components/product-form.component';
import { AlertService } from '@/core/services/alert.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [TableComponent,TitleCreateComponent,DialogModule],
  template: `
  <div class="entrada">
    <app-title-create title="Productos" (onOpenDialog)="openDiloagCrear()" />

    <app-table [header]="header">
      @for (product of product(); track $index) {
        <tr class="hover:bg-gray-100 transition-all">
          <td class="sticky inset-y-0 start-0 bg-white whitespace-nowrap px-4 py-2 font-medium text-gray-900">{{ product.name }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ product.stock }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ product.salePrice }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ product.purchasePrice }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ product.size }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ product.unitMeasurement.name }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ product.category.name }}</td>
        </tr>
      }
    </app-table> 
  </div>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ProductPage implements OnInit {

  #productService = inject(ProductService)
  #dialog = inject(Dialog)
  #alertService = inject(AlertService)

  public product = signal<ProductDto[]>([])
  public header = ["Nombre", "Stock", "Precio Venta", "Precio Compra", "Tamaño", "Unidad", "Categoria"]

  ngOnInit(): void {
    this.#productService.getProduct().subscribe({
      next: (resp) => this.product.set(resp)
    })
  }

  openDiloagCrear() {
    this.#dialog.open(ProductCrearFormComponent, {
      width:"100%",
      data: {
        animal: 'panda',
      },
      disableClose:true,
    });

    
  }

}