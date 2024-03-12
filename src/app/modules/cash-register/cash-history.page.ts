import { CashRegisterHistoryDto } from '@/api/interfaces/cash-register.interface';
import { CashRegisterService } from '@/api/services/cash-register.service';
import { TableDataComponent } from '@/components/table/table-data.component';
import { TableComponent } from '@/components/table/table.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { KeysWithoutId } from '@/helpers/toTable';
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
  imports: [TitleCreateComponent, TableComponent, DatePipe, TableDataComponent],
  template: `
    <app-title-create
      title="Historial De Caja Registradora"
      (onOpenDialog)="openDiloagCrear()"
    />

    <table-data
      [columns]="columns"
      [data]="cashRegisters()"
      [actions]="false"
    />
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

  public columns: KeysWithoutId<CashRegisterHistoryDto>[] = [
    'name',
    'totalCash',
    'nombreEmpleado',
    'date',
  ];
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
