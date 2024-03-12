import {
  CreateCategoryDto,
  CategoryDto,
} from '@/api/interfaces/category.interface';
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
  selector: 'category-form',
  standalone: true,
  imports: [
    DialogLayout,
    ControlComponent,
    ReactiveFormsModule,
    KeyValuePipe,
    ControlErrorPipe,
  ],
  template: `
    <dialog-layout
      [title]="this.data ? 'Actualizar' : 'Crear'"
      (onClose)="closeDialog()"
    >
      <form [formGroup]="form" (ngSubmit)="handleForm()">
        <!-- *************************************** -->
        <!-- ******** Nombre *********************** -->
        <!-- *************************************** -->
        <app-control label="Nombre">
          <input class="input" type="text" formControlName="name" />
          <!-- errores -->
          @if (name.invalid && name.touched) {
            @for (error of name.errors | keyvalue; track $index) {
              <span class="text-red-400 text-sm font-bold">{{
                error | controlError: { minl: 3 }
              }}</span>
            }
          }
        </app-control>
        <!-- *************************************** -->
        <!-- ******** Descripcion ****************** -->
        <!-- *************************************** -->
        <div class="mt-3">
          <app-control label="Descripcion">
            <textarea
              formControlName="description"
              class="w-full input"
              rows="5"
            ></textarea>
            <!-- errores -->
            @if (description.invalid && description.touched) {
              @for (error of description.errors | keyvalue; track $index) {
                <span class="text-red-400 text-sm font-bold">{{
                  error | controlError: { minl: 10 }
                }}</span>
              }
            }
          </app-control>
        </div>

        <div class="flex items-center justify-end mt-10">
          @if (data) {
            <button class="btn btn-secondary w-[200px]">Actulizar</button>
          } @else {
            <button class="btn btn-secondary w-[200px]">Crear</button>
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
export class CategoryFormComponent {
  public form = this.fb.group({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)],
    }),
  });

  get name() {
    return this.form.controls.name;
  }
  get description() {
    return this.form.controls.description;
  }

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: CategoryDto | undefined,
    private fb: FormBuilder,
  ) {
    if (data) {
      this.form.setValue({ description: data.description, name: data.name });
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
