import { AuthRegisterDto } from '@/api/interfaces/auth.interface';
import { ControlComponent } from '@/components/input/control.component';
import { ControlErrorPipe } from '@/core/pipes/control-error.pipe';
import { UserStore } from '@/core/store/user.store';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DialogRef } from '@angular/cdk/dialog';
import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'create-employe',
  standalone: true,
  imports: [
    DialogLayout,
    ReactiveFormsModule,
    ControlErrorPipe,
    ControlComponent,
    KeyValuePipe,
  ],
  template: `
    <dialog-layout title="Crear Empleados" (onClose)="dialogClose()">
      @if (userState().isloding) {
        <p>Cargando.....</p>
      }
      <form [formGroup]="form" class="space-y-4" (ngSubmit)="handleSubmit()">
        <!-- *************************************** -->
        <!-- ******** Email ************************ -->
        <!-- *************************************** -->
        <app-control label="Email">
          <input type="text" class="input" formControlName="email" />
          @if (email.invalid && email.touched) {
            @for (error of email.errors | keyvalue; track $index) {
              <span class="text-red-400 text-sm font-bold">{{
                error | controlError: { minl: 3 }
              }}</span>
            }
          }
        </app-control>

        <!-- *************************************** -->
        <!-- ******** Passsword ******************** -->
        <!-- *************************************** -->
        <app-control label="Password">
          <input type="text" class="input" formControlName="password" />
          @if (password.invalid && password.touched) {
            @for (error of password.errors | keyvalue; track $index) {
              <span class="text-red-400 text-sm font-bold">{{
                error | controlError: { minl: 3 }
              }}</span>
            }
          }
        </app-control>

        <!-- *************************************** -->
        <!-- ******** Name ************************* -->
        <!-- *************************************** -->
        <app-control label="Nombre">
          <input type="text" class="input" formControlName="name" />
          @if (name.invalid && name.touched) {
            @for (error of name.errors | keyvalue; track $index) {
              <span class="text-red-400 text-sm font-bold">{{
                error | controlError: { minl: 3 }
              }}</span>
            }
          }
        </app-control>

        <!-- *************************************** -->
        <!-- ******** Birthday ********************* -->
        <!-- *************************************** -->
        <app-control label="Fecha de Cumpleaños">
          <input type="date" class="input" formControlName="birthday" />
          @if (birthday.invalid && birthday.touched) {
            @for (error of birthday.errors | keyvalue; track $index) {
              <span class="text-red-400 text-sm font-bold">{{
                error | controlError: { minl: 3 }
              }}</span>
            }
          }
        </app-control>

        <!-- *************************************** -->
        <!-- ******** Salary ********************** -->
        <!-- *************************************** -->
        <app-control label="Salario">
          <input type="number" class="input" formControlName="salary" />
          @if (salary.invalid && salary.touched) {
            @for (error of salary.errors | keyvalue; track $index) {
              <span class="text-red-400 text-sm font-bold">{{
                error | controlError: { minl: 3 }
              }}</span>
            }
          }
        </app-control>

        <div class="flex flex-end mt-3 justify-end">
          <button type="submit" class="btn btn-primary btn-sm md:btn-md">
            Crear
          </button>
        </div>
      </form>
    </dialog-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateEmployeComponent {
  #fb = inject(FormBuilder);
  #userStore = inject(UserStore);
  userState = this.#userStore.state;

  form = this.#fb.group({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    birthday: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    salary: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rol: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(private dialogRef: DialogRef<any>) {}

  get email() {
    return this.form.controls.email;
  }
  get password() {
    return this.form.controls.password;
  }
  get name() {
    return this.form.controls.name;
  }
  get birthday() {
    return this.form.controls.birthday;
  }
  get salary() {
    return this.form.controls.salary;
  }
  get rol() {
    return this.form.controls.rol;
  }

  dialogClose() {
    this.dialogRef.close(false);
  }

  handleSubmit() {
    const dto: AuthRegisterDto = this.form.getRawValue();

    this.#userStore.createEmploye(dto);

    if (!this.userState().isloding) {
      this.dialogClose();
    }
  }
}
