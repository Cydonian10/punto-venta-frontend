import { UnitCrearDto, UnitDto } from '@/api/interfaces/unit.interface';
import { ControlComponent } from '@/components/input/control.component';
import { InputComponent } from '@/components/input/input.component';
import { ControlErrorPipe } from '@/core/pipes/control-error.pipe';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-unit-form',
  standalone: true,
  imports: [
    DialogLayout,
    ReactiveFormsModule,
    ControlComponent,
    KeyValuePipe,
    ControlErrorPipe,
  ],
  template: `
    <dialog-layout title="Crear Unidad de Medida" (onClose)="closeDialog()">
      <!-- Formulario -->
      <form [formGroup]="form" (ngSubmit)="handleForm()" class="space-y-4">
        <!-- *************************************** -->
        <!-- ******** Nombre Input *****************-->
        <!-- *************************************** -->

        <app-control label="Nombre">
          <input type="text" formControlName="name" class="input" />
          @if (name.invalid && name.touched) {
            @for (error of name.errors | keyvalue; track $index) {
              <span class="text-red-400 text-sm font-bold">{{
                error | controlError: { minl: 10 }
              }}</span>
            }
          }
        </app-control>

        <!-- *************************************** -->
        <!-- ******** Symbol Input ***************** -->
        <!-- *************************************** -->

        <app-control label="Simbolo">
          <input type="text" formControlName="symbol" class="input" />
          @if (symbol.invalid && symbol.touched) {
            @for (error of symbol.errors | keyvalue; track $index) {
              <span class="text-red-400 text-sm font-bold">{{
                error | controlError: { minl: 10 }
              }}</span>
            }
          }
        </app-control>
        <div class="flex items-center justify-end mt-5">
          <!-- Botones para crear o actulizar -->
          @if (data) {
            <button type="submit" class="btn btn-secondary w-[200px]">
              Actulizar
            </button>
          } @else {
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
    name: new FormControl('', { validators: [Validators.required] }),
    symbol: new FormControl('', { validators: [Validators.required] }),
  });

  get name() {
    return this.form.controls.name;
  }

  get symbol() {
    return this.form.controls.symbol;
  }

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: UnitDto | undefined,
    private fb: FormBuilder,
  ) {
    if (data) {
      this.form.patchValue(data);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  handleForm() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.data) {
      this.dialogRef.close({ ...this.form.getRawValue(), id: this.data.id });
    }
    this.dialogRef.close(this.form.getRawValue());
  }
}
