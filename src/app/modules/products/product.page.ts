import {
  ProductCrearDto,
  ProductDto,
  ProductTable,
  ProductUpdateDto,
} from '@/api/interfaces/products.interface';
import { ProductService } from '@/api/services/product.service';
import { TableComponent } from '@/components/table/table.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
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
import { ProductHistoryComponent } from './components/product-history.component';
import { PriceUpdateComponent } from './components/price-update.component';
import { TableDataComponent } from '@/components/table/table-data.component';
import { KeysWithoutId } from '@/helpers/toTable';

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
    TableDataComponent,
  ],
  template: `
    <div class="entrada print:hidden">
      <app-title-create title="Productos" (onOpenDialog)="openDiloagCrear()">
        <app-product-filter
          (onQuitarFiltro)="quitarFiltro($event)"
          (onAplicarFiltro)="applicarFiltro($event)"
        />
      </app-title-create>

      <table-data
        [columns]="columns"
        [data]="productDataTable()"
        (onUpdate)="openDiloagCrear($event)"
        (onDelete)="deleteProduct($event)"
      />

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

  productDataTable = computed(() =>
    this.products().map(
      (x) =>
        ({
          ...x,
          unit: x.unitMeasurement.name,
          categoryName: x.category.name,
        }) as ProductTable,
    ),
  );

  public columns: KeysWithoutId<ProductTable>[] = [
    'name',
    'salePrice',
    'purchasePrice',
    'type',
    'description',
    'size',
    'categoryName',
    'stock',
    'unit',
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
      width: '700px',
      backdropClass: 'bg-black/60',
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

  updatePrice(id: number, precio: number) {
    const dialogRef = this.#dialog.open(PriceUpdateComponent, {
      width: '100%',
      data: { id, precio },
      disableClose: true,
    });

    dialogRef.closed.subscribe((resp: any) => {
      if (resp === undefined) {
        return;
      }
      this.#productService.updateSalePrice(resp, id).subscribe(() => {
        this.products.update((x) =>
          x.map((x) => {
            if (x.id === id) {
              x.salePrice = parseFloat(resp);
            }
            return x;
          }),
        );
        this.#alertService.showAlertSuccess('Precio Actualizado');
      });
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

  historyProduct(id: number) {
    this.#dialog.open(ProductHistoryComponent, {
      width: '100%',
      data: { id },
      disableClose: true,
    });
  }

  applicarFiltro(value: any) {
    this.#productService.getFilter(value).subscribe((resp) => {
      this.#alertService.showAlertSuccess('Filtro aplicado');
      this.products.set(resp);
    });
  }

  quitarFiltro(value?: any) {
    this.getProducts();
  }
}
