import {
  Customer,
  Employed,
  EmployedRoles,
  Rol,
} from '@/api/interfaces/user.interface';
import { ControlComponent } from '@/components/input/control.component';
import { UserStore } from '@/core/store/user.store';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { SelectionModel } from '@angular/cdk/collections';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'update-employee',
  standalone: true,
  imports: [ReactiveFormsModule, DialogLayout, ControlComponent],
  template: `
    <dialog-layout title="Title" (onClose)="closeDialog()">
      <form
        class="space-y-4"
        [formGroup]="form"
        (ngSubmit)="handleUpdateUser()"
      >
        <!-- *************************************** -->
        <!-- ******** Nombre ********************** -->
        <!-- *************************************** -->
        <app-control label="Nombre">
          <input class="input" type="text" formControlName="name" />
        </app-control>

        <!-- *************************************** -->
        <!-- ******** Email *********************** -->
        <!-- *************************************** -->
        <app-control label="Email">
          <input class="input" type="email" formControlName="email" />
        </app-control>

        <!-- *************************************** -->
        <!-- ******** Salario ********************** -->
        <!-- *************************************** -->
        <app-control label="Salario">
          <input class="input" type="number" formControlName="salary" />
        </app-control>

        <!-- *************************************** -->
        <!-- ******** Salario ********************** -->
        <!-- *************************************** -->
        <app-control label="Fecha Nacimiento">
          <input
            class="input"
            type="datetime-local"
            formControlName="birthday"
          />
        </app-control>

        <div class="flex justify-end">
          <button class="btn-ghost ghost-primary">Actulizar Usuario</button>
        </div>
      </form>

      @for (op of opciones; track $index) {
        <div>
          <label>
            <input
              type="checkbox"
              [checked]="selection.isSelected(op)"
              (change)="selection.toggle(op)"
            />
            {{ op }}
          </label>
        </div>
      }
      <div class="flex gap-2">
        <button class="btn btn-primary btn-sm" (click)="addRoles()">
          Agregar
        </button>
        <button class="btn btn-danger btn-sm" (click)="removeRoles()">
          Remover
        </button>
      </div>

      @for (rol of data.roles; track $index) {
        <p>{{ rol }}</p>
      }
    </dialog-layout>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateEmployeeComponent {
  #userStore = inject(UserStore);

  id = signal<string>('');

  form = this.fb.group({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    salary: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    birthday: new FormControl<Date>(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  opciones = Object.keys(Rol).map((key) => key);

  selection = new SelectionModel<any>(true, []);

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: Employed,
    private fb: FormBuilder,
  ) {
    if (data) {
      this.form.patchValue({ ...data });
    }
    this.id.set(data.id);
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  handleUpdateUser() {
    this.#userStore.updateUser(this.id(), this.form.getRawValue());
    this.dialogRef.close(false);
  }

  addRoles() {
    this.#userStore.addRol({
      email: this.form.controls.email.getRawValue()!,
      roles: this.selection.selected,
    });
    this.dialogRef.close(false);
  }

  removeRoles() {
    this.#userStore.removeRol({
      email: this.form.controls.email.getRawValue()!,
      roles: this.selection.selected,
    });
    this.dialogRef.close(false);
  }
}
