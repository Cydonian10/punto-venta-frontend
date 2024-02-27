import { UnitCrearDto, UnitDto } from '@/api/interfaces/unit.interface';
import { InputComponent } from '@/components/input/input.component';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-unit-form',
  standalone: true,
  imports: [DialogLayout, ReactiveFormsModule, InputComponent],
  template: `
    <dialog-layout title="Crear Unidad de Medida" (onClose)="closeDialog()">
      <!-- Formulario -->
      <form [formGroup]="form" (ngSubmit)="handleForm()">
        <app-input [control]="form.controls.name" label="Nombre" />
        <app-input [control]="form.controls.symbol" label="Simbolo" />

        <div class="flex items-center justify-end mt-5">
          <!-- Botones para crear o actulizar -->
          @if (data) {
          <button type="submit" class="btn btn-secondary w-[200px]">
            Actulizar
          </button>
          }@else {
          <button type="submit" class="btn btn-secondary w-[200px]">
            Crear
          </button>
          }
        </div>
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
export class UnitFormComponent {
  public form = this.fb.group({
    name: new FormControl("", {validators:[Validators.required]}),
    symbol: new FormControl("", {validators:[Validators.required]}),
  });

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: UnitDto | undefined,
    private fb: FormBuilder
  ) {
    if(data) {
      this.form.patchValue(data)
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  handleForm() {
    if(this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    if(this.data) {
      this.dialogRef.close({...this.form.getRawValue(),id:this.data.id})
    }
    this.dialogRef.close(this.form.getRawValue())
  }
}
