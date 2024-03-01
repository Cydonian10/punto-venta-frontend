import { TableComponent } from '@/components/table/table.component';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { SupplierDto } from '@/api/interfaces/suppliers.interface';
import { SupplierService } from '@/api/services/supplier.service';

@Component({
  selector: 'app-select-supplier',
  standalone: true,
  imports: [DialogLayout, TableComponent],
  template: `
    <dialog-layout title="Selecionar Proveedor" (onClose)="closeDialog()">
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
                (click)="handleSelectSupplier(supplier)"
                class="btn-icon btn-icon-primary px-2 py-1"
              >
                <i class="bx bxs-add-to-queue"></i>
              </button>
            </div>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSupplierComponent {
  #supplierService = inject(SupplierService);

  public header = ['N°', 'Nombre', 'Telefono', 'Avenida', 'Acciones'];
  public suppliers = signal<SupplierDto[]>([]);

  constructor(private dialogRef: DialogRef<any>) {}

  ngOnInit(): void {
    this.#supplierService.getSuppliers().subscribe((resp) => {
      this.suppliers.set(resp);
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  handleSelectSupplier(supplier: SupplierDto) {
    this.dialogRef.close(supplier);
  }
}
