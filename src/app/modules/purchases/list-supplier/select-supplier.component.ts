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
import { TableDataComponent } from '@/components/table/table-data.component';
import { KeysWithoutId } from '@/helpers/toTable';

@Component({
  selector: 'app-select-supplier',
  standalone: true,
  imports: [DialogLayout, TableDataComponent],
  template: `
    <dialog-layout title="Selecionar Proveedor" (onClose)="closeDialog()">
      <table-data
        [columns]="columns"
        [data]="suppliers()"
        [select]="true"
        [actions]="false"
        (onSelect)="handleSelectSupplier($event)"
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
export class SelectSupplierComponent {
  #supplierService = inject(SupplierService);

  public columns: KeysWithoutId<SupplierDto>[] = ['name', 'phone', 'adress'];
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
