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

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [TitleCreateComponent, TableComponent, OverlayModule],
  template: `
    <div class="entrada">
      <app-title-create
        title="Proveedores"
        (onOpenDialog)="openDiloagCrear()"
      ></app-title-create>

      <app-table [header]="header">
        @for (supplier of suppliers(); track $index) {
        <tr class="hover:bg-gray-100 transition-all">
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ $index + 1 }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ supplier.name }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ supplier.phone }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ supplier.adress }}
          </td>
          <td>
            <div class="flex items-start gap-2">
              <button
                class="btn-icon btn-icon-success px-2 py-1"
                (click)="openDiloagCrear(supplier)"
              >
                <i class="bx bxs-pencil"></i>
              </button>
              <button
                class="btn-icon btn-icon-danger px-2 py-1"
                (click)="deleteProduct(supplier.id)"
              >
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SupplierPage implements OnInit {
  #supplierService = inject(SupplierService);
  #dialog = inject(Dialog);
  #alertService = inject(AlertService);

  public header = ['N°', 'Nombre', 'Telefono', 'Avenida', 'Acciones'];
  public suppliers = signal<SupplierDto[]>([]);

  ngOnInit(): void {
    this.#supplierService.getSuppliers().subscribe((resp) => {
      this.suppliers.set(resp);
    });
  }

  deleteProduct(arg0: any) {
    throw new Error('Method not implemented.');
  }
  openDiloagCrear(supplier?: SupplierDto) {
    const dialogRef = this.#dialog.open(CreateSupplieComponent, {
      width: '100%',
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
