import { UnitCrearDto, UnitDto, UnitUpdateDto } from '@/api/interfaces/unit.interface';
import { UnitService } from '@/api/services/unit.service';
import { TableComponent } from '@/components/table/table.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UnitFormComponent } from './components/unit-form.component';
import { AlertService } from '@/core/services/alert.service';

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [TableComponent,TitleCreateComponent,DialogModule],
  template: `

  <div class="entrada">
    <app-title-create title="Unidades de Medida" (onOpenDialog)="openDiloagCrear()" />

    <app-table [header]="header">
      @for (unit of units(); track $index) {
        <tr class="hover:bg-gray-100 transition-all">
          <td class="sticky inset-y-0 start-0 bg-white whitespace-nowrap px-4 py-2 font-medium text-gray-900">{{ $index + 1 }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ unit.name }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ unit.symbol }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            <div class="flex items-start gap-2">
              <button class="btn-icon btn-icon-primary px-2 py-1" (click)="openDiloagCrear(unit)">
                <i class="bx bxs-pencil"></i>
              </button>
              <button class="btn-icon btn-icon-danger px-2 py-1" (click)="deleteUnit(unit)">
                <i class="bx bxs-trash-alt"></i>
              </button>
            </div>
          </td>
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
export default class UnitPage {

  #unitService = inject(UnitService)
  #dialog = inject(Dialog)
  #alertService = inject(AlertService)

  public units = signal<UnitDto[]>([])
  public header = ["N°", "Nombre", "Simbolo"]

  ngOnInit(): void {
    this.#unitService.getUnits().subscribe({
      next: (resp) => this.units.set(resp)
    }
    )
  }

  openDiloagCrear(data?:UnitDto) {
    const dialogRef = this.#dialog.open(UnitFormComponent, {
      width:"100%",
      data,
      disableClose:true,
    });

    dialogRef.closed.subscribe( (resp:any) => {
      if(resp === undefined) {
        this.#alertService.showAlertWarning("Cancelado")
        return;
      }
      if(resp.id) {
        const {id,...rest} = resp
        this.updateUnit(rest,id)
      }else {
        this.crearUnit(resp)
      }

      // this.crearUnit(resp);
    })
  }

  crearUnit(data:UnitCrearDto) {
    this.#unitService.crearUnit(data).subscribe( (resp:any) => {
      this.units.update(old => [resp,...old])
      this.#alertService.showAlertSuccess("Creado correctamente")
    })
  }

  updateUnit(data:UnitUpdateDto,id:number) {
    this.#unitService.updateUnit(data,id).subscribe(() => {
      this.units.update(old => {
        return old.map( item => {
          if(item.id === id) {
            item = {...data,id}
          }
          return item
        })
      })
      this.#alertService.showAlertSuccess("Actulizado correctamente")
    })
  }

  deleteUnit(data:UnitDto){
    const alert =  window.confirm("Estas seguro de eliminar ? "+ data.name)
    if(alert) {
      this.#unitService.deleteUnit(data.id).subscribe( () => {
        this.units.update(old => old.filter(item => item.id !== data.id))
        this.#alertService.showAlertSuccess("Eliminado correctamente")
      })
    }
  }

 
}