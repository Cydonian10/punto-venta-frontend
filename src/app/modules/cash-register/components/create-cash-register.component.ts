import { CreateCashRegisterDto } from '@/api/interfaces/cash-register.interface';
import { CashRegisterService } from '@/api/services/cash-register.service';
import { ControlComponent } from '@/components/input/control.component';
import { ControlErrorPipe } from '@/core/pipes/control-error.pipe';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'create-cash-register',
  standalone: true,
  imports: [
    DialogLayout,
    ReactiveFormsModule,
    ControlComponent,
    ControlErrorPipe,
    KeyValuePipe,
  ],
  template: `
    <dialog-layout title="Crear Nueva Caja" (onClose)="closeDialog()">
      <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-5">
        <app-control label="Nombre">
          <input type="text" class="input" formControlName="name" />
          @if (name.invalid && name.touched) {
            @for (error of name.errors | keyvalue; track $index) {
              <span class="text-red-400 text-sm font-bold">{{
                error | controlError: { minl: 10 }
              }}</span>
            }
          }
        </app-control>
        <app-control label="Monto Incial">
          <input type="number" class="input" formControlName="initialCash" />
          @if (initialCash.invalid && initialCash.touched) {
            @for (error of initialCash.errors | keyvalue; track $index) {
              <span class="text-red-400 text-sm font-bold">{{
                error | controlError: { minl: 10 }
              }}</span>
            }
          }
        </app-control>

        <button type="submit" class="btn btn-secondary">Enviar</button>
      </form>
    </dialog-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCashRegisterComponent {
  #cashRegisterService = inject(CashRegisterService);
  #fb = inject(FormBuilder);

  form = this.#fb.group({
    name: new FormControl('', {
      validators: [Validators.required],
    }),
    initialCash: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
  });

  get name() {
    return this.form.controls.name;
  }

  get initialCash() {
    return this.form.controls.initialCash;
  }

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: { titulo: '' },
  ) {}

  closeDialog() {
    this.dialogRef.close(false);
  }

  handleSubmit() {
    const data: CreateCashRegisterDto = {
      name: this.form.getRawValue().name!,
      initialCash: this.form.getRawValue().initialCash!,
      date: new Date(),
    };

    this.dialogRef.close(data);
  }
}
