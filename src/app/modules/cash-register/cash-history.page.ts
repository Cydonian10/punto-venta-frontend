import { CashRegisterHistoryDto } from '@/api/interfaces/cash-register.interface';
import { CashRegisterService } from '@/api/services/cash-register.service';
import { TableComponent } from '@/components/table/table.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-cash-history',
  standalone: true,
  imports: [TitleCreateComponent, TableComponent, DatePipe],
  template: `
    <app-title-create
      title="Historial De Caja Registradora"
      (onOpenDialog)="openDiloagCrear()"
    />

    <app-table [header]="header">
      @for (item of cashRegisters(); track $index) {
      <tr class="hover:bg-gray-100 transition-all">
        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
          {{ $index + 1 }}
        </td>
        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
          {{ item.name }}
        </td>
        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
          {{ item.totalCash }}
        </td>

        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
          {{ item.nombreEmpleado }}
        </td>

        <td class="whitespace-nowrap px-4 py-2 text-gray-700">
          {{ item.date | date }}
        </td>
      </tr>
      }
    </app-table>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CashHistoryPage implements OnInit {
  @Input('id') id: number = 0;

  #cashRegisterService = inject(CashRegisterService);

  public header: string[] = ['N°', 'Name', 'Monto Total', 'Empleado', 'fecha'];
  public cashRegisters = signal<CashRegisterHistoryDto[]>([]);

  ngOnInit(): void {
    console.log(this.id);
    this.#cashRegisterService.getHistory(this.id).subscribe((resp) => {
      console.log(resp);
      this.cashRegisters.set(resp);
    });
  }

  openDiloagCrear() {}
}
