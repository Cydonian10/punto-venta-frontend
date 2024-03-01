import { TableComponent } from '@/components/table/table.component';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, inject, signal } from '@angular/core';
import { SaleService } from '../../../api/services/sale.service';
import { SaleDto } from '@/api/interfaces/sale.interface';

@Component({
  selector: 'app-mis-ventas',
  standalone: true,
  imports: [DialogLayout,TitleCasePipe,TableComponent,DatePipe],
  template: `
     <dialog-layout
      [title]="this.data.titulo | titlecase"
      (onClose)="closeDialog()"
    >
      <app-table [header]="header">
        @for (sale of sales(); track $index) {
          <tr class="hover:bg-gray-100 transition-all">
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                {{sale.vaucherNumber}}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                {{sale.customer.email}}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                S/ {{sale.totalPrice}}
            </td>
            <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                {{sale.date | date }}
            </td>
          </tr>
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
export class MisVentasComponent implements OnInit {

  #saleService =  inject(SaleService)
  public sales = signal<SaleDto[]>([])
  public header = ["Vaucher","Cliente","Precio Total","Fecha"]

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: { titulo: "" }
  ) {}

  ngOnInit(): void {
    this.#saleService.mySales().subscribe( resp => {
      console.log(resp);
      this.sales.set(resp)
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

}