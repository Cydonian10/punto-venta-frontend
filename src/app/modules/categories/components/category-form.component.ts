import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'category-form',
  standalone: true,
  imports: [DialogLayout],
  template: `
    <dialog-layout title="Crear Categoria" (onClose)="closeDialog()">

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

  constructor(private dialogRef:DialogRef) {}

  closeDialog() {
    this.dialogRef.close() 
  }

}