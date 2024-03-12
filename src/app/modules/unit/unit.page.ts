import {
  UnitCrearDto,
  UnitDto,
  UnitUpdateDto,
} from '@/api/interfaces/unit.interface';
import { UnitService } from '@/api/services/unit.service';
import { TableComponent } from '@/components/table/table.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { UnitFormComponent } from './components/unit-form.component';
import { AlertService } from '@/core/services/alert.service';
import { TableDataComponent } from '@/components/table/table-data.component';

@Component({
  selector: 'app-unit',
  standalone: true,
  imports: [TitleCreateComponent, DialogModule, TableDataComponent],
  template: `
    <div class="entrada">
      <app-title-create
        title="Unidades de Medida"
        (onOpenDialog)="openDiloagCrear()"
      />

      <table-data
        [columns]="columns"
        [data]="units()"
        (onUpdate)="openDiloagCrear($event)"
        (onDelete)="deleteUnit($event)"
      />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UnitPage {
  #unitService = inject(UnitService);
  #dialog = inject(Dialog);
  #alertService = inject(AlertService);

  public units = signal<UnitDto[]>([]);
  public header = ['N°', 'Nombre', 'Simbolo'];
  public columns = ['name', 'symbol'];

  ngOnInit(): void {
    this.#unitService.getUnits().subscribe({
      next: (resp) => this.units.set(resp),
    });
  }

  openDiloagCrear(data?: UnitDto) {
    const dialogRef = this.#dialog.open(UnitFormComponent, {
      width: '400px',
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
        const { id, ...rest } = resp;
        this.updateUnit(rest, id);
      } else {
        this.crearUnit(resp);
      }

      // this.crearUnit(resp);
    });
  }

  crearUnit(data: UnitCrearDto) {
    this.#unitService.crearUnit(data).subscribe((resp: any) => {
      this.units.update((old) => [resp, ...old]);
      this.#alertService.showAlertSuccess('Creado correctamente');
    });
  }

  updateUnit(data: UnitUpdateDto, id: number) {
    this.#unitService.updateUnit(data, id).subscribe(() => {
      this.units.update((old) => {
        return old.map((item) => {
          if (item.id === id) {
            item = { ...data, id };
          }
          return item;
        });
      });
      this.#alertService.showAlertSuccess('Actulizado correctamente');
    });
  }

  deleteUnit(data: UnitDto) {
    const alert = window.confirm('Estas seguro de eliminar ? ' + data.name);
    if (alert) {
      this.#unitService.deleteUnit(data.id).subscribe(() => {
        this.units.update((old) => old.filter((item) => item.id !== data.id));
        this.#alertService.showAlertSuccess('Eliminado correctamente');
      });
    }
  }
}
