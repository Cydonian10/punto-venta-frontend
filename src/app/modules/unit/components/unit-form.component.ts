import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-unit-form',
  standalone: true,
  imports: [DialogLayout],
  template: `
    <dialog-layout title="Crear Unidad de Medida" (onClose)="closeDialog()">
      
    </dialog-layout>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnitFormComponent {

  constructor(private dialogRef:DialogRef) {}

  closeDialog() {
    this.dialogRef.close()
  }


}