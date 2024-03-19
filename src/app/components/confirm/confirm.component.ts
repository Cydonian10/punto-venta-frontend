import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [DialogLayout, TitleCasePipe],
  template: `
    <dialog-layout
      [title]="this.data.titulo | titlecase"
      (onClose)="closeDialog()"
    >
      <div class="flex gap-4">
        <button (click)="handleConfirm()" class="btn btn-primary">Si</button>
        <button (click)="handleCancel()" class="btn-ghost ghost-danger">
          Cancelar
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
export class ConfirmComponent {
  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: { titulo: '' },
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  handleConfirm() {
    this.dialogRef.close(true);
  }

  handleCancel() {
    this.dialogRef.close(false);
  }
}
