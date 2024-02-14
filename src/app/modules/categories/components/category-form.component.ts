import { CategoryCrearDto, CategoryDto } from '@/api/interfaces/category.interface';
import { InputComponent } from '@/components/input/input.component';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'category-form',
  standalone: true,
  imports: [DialogLayout,InputComponent,ReactiveFormsModule],
  template: `
    <dialog-layout title="Crear Categoria" (onClose)="closeDialog()">
      <form [formGroup]="form"  (ngSubmit)="handleForm()">
          <app-input [control]="form.controls.name"  type="text" label="Nombre" />
          
          <div class="mt-3">
            <label 
              class="block text-sm font-bold text-gray-700"> 
              Descripcion
            </label>
            <textarea formControlName="description" class="w-full input" rows="5"></textarea>
          </div>

          <div class="flex items-center justify-end">
            @if (data) {
              <button class="btn btn-secondary w-[200px]">Actulizar</button>
            }@else {
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryFormComponent {

  public form = this.fb.group({
    "name": new FormControl(),
    "description": new FormControl()
  })

  constructor(
    private dialogRef:DialogRef<any>,
    @Inject(DIALOG_DATA) public data: CategoryDto | undefined,
    private fb:FormBuilder
  ) {
    if(data) {
      this.form.setValue({description:data.description, name:data.name})
    }
  }

  closeDialog() {
    this.dialogRef.close() 
  }

  handleForm() {
    if(this.data) {
      this.dialogRef.close({...this.form.getRawValue(), id:this.data.id})
    }
    this.dialogRef.close(this.form.getRawValue())
  }

}