import { SupplierService } from '@/api/services/supplier.service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { TitleCreateComponent } from '../../components/title/title-create.component';
import { TableComponent } from '@/components/table/table.component';
import { SupplierDto } from '@/api/interfaces/suppliers.interface';
import { Dialog } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { CreateSupplieComponent } from './components/supplier-create.component';
import { AlertService } from '@/core/services/alert.service';
import { TableDataComponent } from '@/components/table/table-data.component';
import { KeysWithoutId } from '@/helpers/toTable';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [
    TitleCreateComponent,
    TableComponent,
    OverlayModule,
    TableDataComponent,
  ],
  template: `
    <div class="entrada">
      <app-title-create
        title="Proveedores"
        (onOpenDialog)="openDiloagCrear()"
      ></app-title-create>

      <table-data
        [columns]="columns"
        [data]="suppliers()"
        (onUpdate)="openDiloagCrear($event)"
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
export default class SupplierPage implements OnInit {
  #supplierService = inject(SupplierService);
  #dialog = inject(Dialog);
  #alertService = inject(AlertService);

  public header = ['N°', 'Nombre', 'Telefono', 'Avenida', 'Acciones'];
  public columns: KeysWithoutId<SupplierDto>[] = ['name', 'phone', 'adress'];
  public suppliers = signal<SupplierDto[]>([]);

  ngOnInit(): void {
    this.#supplierService.getSuppliers().subscribe((resp) => {
      this.suppliers.set(resp);
    });
  }

  deleteSupplier(arg0: any) {
    throw new Error('Method not implemented.');
  }

  openDiloagCrear(supplier?: SupplierDto) {
    const dialogRef = this.#dialog.open(CreateSupplieComponent, {
      width: '400px',
      backdropClass: ['bg-black/60'],
      data: supplier,
      disableClose: true,
    });

    dialogRef.closed.subscribe((resp: any) => {
      if (resp) {
        if (resp.id) {
          this.#supplierService.update(resp).subscribe(() => {
            this.#alertService.showAlertSuccess('Actulizado Correctamente');
            this.suppliers.update((value) => [resp, ...value]);
          });
        } else {
          this.#supplierService.create(resp).subscribe(() => {
            this.#alertService.showAlertSuccess('Actulizado Correctamente');
            this.suppliers.update((value) => [resp, ...value]);
          });
        }
      }
    });
  }
}
