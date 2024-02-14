import { UnitDto } from '@/api/interfaces/unit.interface';
import { UnitService } from '@/api/services/unit.service';
import { TableComponent } from '@/components/table/table.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UnitFormComponent } from './components/unit-form.component';

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [TableComponent,TitleCreateComponent,DialogModule],
  template: `

    <app-title-create title="Unidades de Medida" (onOpenDialog)="openDiloagCrear()" />

    <app-table [header]="header">
      @for (unit of units(); track $index) {
        <tr class="hover:bg-gray-100 transition-all">
          <td class="sticky inset-y-0 start-0 bg-white whitespace-nowrap px-4 py-2 font-medium text-gray-900">{{ $index }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ unit.name }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ unit.symbol }}</td>
        </tr>  
      }
    </app-table>

  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class UnitPage {

  #categoryService = inject(UnitService)
  #dialog = inject(Dialog)

  public units = signal<UnitDto[]>([])
  public header = ["N°", "Nombre", "Simbolo"]

  ngOnInit(): void {
    this.#categoryService.getUnits().subscribe({
      next: (resp) => this.units.set(resp)
    }
    )
  }

  openDiloagCrear() {
    this.#dialog.open(UnitFormComponent, {
      width:"100%",
      data: {
        animal: 'panda',
      },
      disableClose:true,
    });
  }

 
}