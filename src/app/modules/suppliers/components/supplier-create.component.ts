import { SupplierDto } from '@/api/interfaces/suppliers.interface';
import { InputComponent } from '@/components/input/input.component';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-create-supplie',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, DialogLayout],
  template: `
    <dialog-layout
      [title]="this.data ? 'Actualizar' : 'Crear'"
      (onClose)="closeDialog()"
    >
      <form [formGroup]="form" class="space-y-3">
        <app-input label="Nombre" [control]="form.controls.name" />
        <app-input label="Direccion" [control]="form.controls.adress" />
        <app-input label="Telefono" [control]="form.controls.phone" />

        @if(data) {
        <button
          (click)="handleSubmit()"
          type="button"
          class="btn btn-primary mt-3"
        >
          Actualizar
        </button>
        }@else {
        <button
          (click)="handleSubmit()"
          type="button"
          class="btn btn-primary mt-3"
        >
          Crear
        </button>
        }
      </form>
    </dialog-layout>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateSupplieComponent {
  form = this.fb.nonNullable.group({
    name: new FormControl('', { validators: [Validators.required] }),
    adress: new FormControl('', { validators: [Validators.required] }),
    phone: new FormControl('', { validators: [Validators.required] }),
  });

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: SupplierDto | undefined,
    private fb: FormBuilder
  ) {
    if (data) {
      this.form.patchValue({ ...data });
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  handleSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }
}
