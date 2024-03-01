import { InputComponent } from '@/components/input/input.component';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-open-cash',
  standalone: true,
  imports: [ReactiveFormsModule,DialogLayout,InputComponent],
  template: `
    <dialog-layout title="Abriendo Caja" (onClose)="closeDialog()">
      <app-input type="number" [control]="montoInput" label="Monto Incial" />
      <div class="mt-4 flex justify-end">
        <button (click)="handleOpenCashRegister()" class="btn btn-primary">Abrir Caja</button>
      </div>
    </dialog-layout>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpenCashComponent {

  public montoInput = new FormControl(0,{validators:Validators.required})

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: { titulo: "" }
  ) {}

  closeDialog() {
    this.dialogRef.close(false)
  }

  handleOpenCashRegister() {
    if(this.montoInput.getRawValue() === 0) {
      this.dialogRef.close(false)
      return
    }
    this.dialogRef.close(this.montoInput.getRawValue())
  }
}