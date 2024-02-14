
import { InputComponent } from '@/components/input/input.component';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'product-crear-form',
  standalone: true,
  imports: [DialogLayout,InputComponent],
  template: `
    <dialog-layout title="Crear Producto" (onClose)="closeDialog()">
      <form action="">
       <app-input label="Nombre" type="text" />
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
export class ProductCrearFormComponent {

  constructor(private dialogRef:DialogRef) {}

  closeDialog() {
    this.dialogRef.close()
  }

 
}