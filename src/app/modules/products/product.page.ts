import {
  ProductCrearDto,
  ProductDto,
  ProductUpdateDto,
} from '@/api/interfaces/products.interface';
import { ProductService } from '@/api/services/product.service';
import { TableComponent } from '@/components/table/table.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ProductCrearFormComponent } from './components/product-form.component';
import { ProductFilterComponent } from './components/product-filter.component';
import { AlertService } from '@/core/services/alert.service';
import { PageDto } from '@/api/interfaces/page.interface';
import { PaginacionComponent } from '@/components/paginación/paginacion.component';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    TableComponent,
    TitleCreateComponent,
    DialogModule,
    OverlayModule,
    ProductFilterComponent,
    PaginacionComponent,
  ],
  template: `
    <div class="entrada">
      <app-title-create title="Productos" (onOpenDialog)="openDiloagCrear()">
        <app-product-filter
          (onQuitarFiltro)="quitarFiltro($event)"
          (onAplicarFiltro)="applicarFiltro($event)"
        />
      </app-title-create>

      <app-table [header]="header">
        @for (product of products(); track $index) {
        <tr class="hover:bg-gray-100 transition-all">
          <td
            class="sticky inset-y-0 start-0 bg-white whitespace-nowrap px-4 py-2 font-medium text-gray-900"
          >
            {{ product.name }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ product.stock }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ product.salePrice }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ product.purchasePrice }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ product.size }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ product.unitMeasurement.name }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ product.category.name }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            <div class="flex items-start gap-2">
              <button
                class="btn-icon btn-icon-primary px-2 py-1"
                (click)="openDiloagCrear(product)"
              >
                <i class="bx bxs-pencil"></i>
              </button>
              <button
                class="btn-icon btn-icon-danger px-2 py-1"
                (click)="deleteProduct(product.id)"
              >
                <i class="bx bxs-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
        }
      </app-table>

      <div>
        <app-paginacion
          (onPrevius)="previus($event)"
          (onNext)="next($event)"
          [totalPage]="totalPage()"
          [paginacion]="pagination()"
        />
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
export default class ProductPage implements OnInit {
  #productService = inject(ProductService);
  #dialog = inject(Dialog);
  #alertService = inject(AlertService);

  public products = signal<ProductDto[]>([]);
  public header = [
    'Nombre',
    'Stock',
    'Precio Venta',
    'Precio Compra',
    'Tamaño',
    'Unidad',
    'Categoria',
    'Actions',
  ];
  public pagination = signal<PageDto>({ page: 1, quantityRecordsPerPage: 4 });
  public totalPage = signal<number>(0);

  ngOnInit(): void {
    this.getProducts();
  }

  next(value: PageDto) {
    this.pagination.set(value);
    this.getProducts();
  }

  previus(value: PageDto) {
    this.pagination.set(value);
    this.getProducts();
  }

  getProducts() {
    this.#productService.getProduct(this.pagination()).subscribe({
      next: (resp) => {
        this.totalPage.set(resp.totalPages);
        this.products.set(resp.data);
      },
    });
  }

  openDiloagCrear(data?: ProductDto) {
    const dialogRef = this.#dialog.open(ProductCrearFormComponent, {
      width: '100%',
      data,
      disableClose: true,
    });

    dialogRef.closed.subscribe((resp: any) => {
      if (resp === undefined) {
        this.#alertService.showAlertWarning('Cancelado');
        return;
      }
      if (resp.id) {
        const { id, ...res } = resp;
        this.updateProduct(res, id);
      } else {
        this.crearProduct(resp);
      }
    });
  }

  crearProduct(data: ProductCrearDto) {
    this.#productService.crearProduct(data).subscribe((resp: any) => {
      this.products.update((old) => [resp, ...old]);
      this.#alertService.showAlertSuccess('Creado correctamente');
    });
  }

  updateProduct(data: ProductUpdateDto, id: number) {
    this.#productService.updateProduct(data, id).subscribe(() => {
      this.products.update((old) => {
        return old.map((item) => {
          if (item.id === id) {
            item = {
              ...data,
              id: id,
              image: null,
              category: item.category,
              unitMeasurement: item.unitMeasurement,
            };
          }
          return item;
        });
      });
      this.#alertService.showAlertSuccess('Actualizado correctamente');
    });
  }

  deleteProduct(id: number) {
    const alert = window.confirm('Estas seguro de eliminar ? ');

    if (alert) {
      this.#productService.deleteProduct(id).subscribe((resp) => {
        this.products.update((old) => old.filter((item) => item.id !== id));
        this.#alertService.showAlertSuccess('Eliminado correctamente');
      });
    }
  }

  applicarFiltro(value: any) {
    this.#productService.getFilter(value).subscribe((resp) => {
      this.#alertService.showAlertSuccess('Filtro aplicado');
      this.products.set(resp);
    });
  }

  quitarFiltro(value: any) {
    this.getProducts();
  }
}
