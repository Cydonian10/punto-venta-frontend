import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DatePipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { SaleService } from '@/api/services/sale.service';
import { SaleDto, SaleTableDto } from '@/api/interfaces/sale.interface';
import { TableDataComponent } from '@/components/table/table-data.component';
import { KeysWithoutId } from '@/helpers/toTable';
import { PaginacionComponent } from '@/components/paginación/paginacion.component';

@Component({
  selector: 'app-mis-ventas',
  standalone: true,
  imports: [
    DialogLayout,
    TitleCasePipe,
    TableDataComponent,
    DatePipe,
    PaginacionComponent,
  ],
  template: `
    <dialog-layout
      [title]="this.data.titulo | titlecase"
      (onClose)="closeDialog()"
    >
      <table-data
        [columns]="columns"
        [data]="salesTableData()"
        [actions]="false"
      />
      <app-paginacion
        [paginacion]="{
          page: 1,
          quantityRecordsPerPage: 4
        }"
        [totalPage]="12"
      />
    </dialog-layout>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MisVentasComponent implements OnInit {
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

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: { titulo: '' },
  ) {}

  ngOnInit(): void {
    this.#saleService.mySales().subscribe((resp) => {
      this.sales.set(resp);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
