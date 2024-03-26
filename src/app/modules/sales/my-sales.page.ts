import { SaleDto, SaleTableDto } from '@/api/interfaces/sale.interface';
import { SaleService } from '@/api/services/sale.service';
import { PaginacionComponent } from '@/components/paginación/paginacion.component';
import { TableDataComponent } from '@/components/table/table-data.component';
import { KeysWithoutId } from '@/helpers/toTable';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-my-sales',
  standalone: true,
  imports: [TableDataComponent, PaginacionComponent],
  template: `
    <table-data
      [columns]="columns"
      (onDelete)="handleDelete($event)"
      [data]="salesTableData()"
      [actions]="true"
    />
    <app-paginacion
      [paginacion]="{
        page: 1,
        quantityRecordsPerPage: 4
      }"
      [totalPage]="12"
    />
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MySalesPage {
  #saleService = inject(SaleService);
  public sales = signal<SaleDto[]>([]);
  public header = ['Vaucher', 'Cliente', 'Precio Total', 'Fecha'];
  public columns: KeysWithoutId<SaleTableDto>[] = [
    'vaucherNumber',
    'customerName',
    'totalPrice',
    'date',
  ];
  public salesTableData = computed(() =>
    this.sales().map(
      (x) =>
        ({
          ...x,
          customerName: x.customer.name,
        }) as SaleTableDto,
    ),
  );

  ngOnInit(): void {
    this.#saleService.mySales().subscribe((resp) => {
      this.sales.set(resp);
    });
  }

  handleDelete(event: SaleDto) {
    this.#saleService
      .deleteSale(event.id, event.cashRegister.id)
      .subscribe((resp) => console.log(resp));
  }
}
