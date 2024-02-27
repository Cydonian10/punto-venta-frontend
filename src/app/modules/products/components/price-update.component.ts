import { InputComponent } from '@/components/input/input.component';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-price-update',
  standalone: true,
  imports: [DialogLayout, ReactiveFormsModule, InputComponent],
  template: `
    <dialog-layout [title]="'Actualizar Precio'" (onClose)="closeDialog()">
      <app-input label="Precio de venta" [control]="priceInput" type="number" />
      <div class="mt-3 flex justify-end">
        <button (click)="handleSubmit()" class="btn btn-primary" type="button">
          Actulizar
        </button>
      </div>
    </dialog-layout>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceUpdateComponent {
  public priceInput = new FormControl(0, { validators: Validators.required });

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: any
  ) {
    this.priceInput.setValue(data.precio);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  handleSubmit() {
    if (this.priceInput.getRawValue() === this.data.precio) {
      this.dialogRef.close();
      return;
    }

    this.dialogRef.close(this.priceInput.getRawValue());
  }
}
