import { UserFull } from '@/api/interfaces/user.interface';
import { UserService } from '@/api/services/user.service';
import { TableDataComponent } from '@/components/table/table-data.component';
import { TableComponent } from '@/components/table/table.component';
import { UserStore } from '@/core/store/user.store';
import { KeysWithoutId } from '@/helpers/toTable';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-selec-user',
  standalone: true,
  imports: [DialogLayout, TableComponent, TableDataComponent],
  template: `
    <dialog-layout title="Selecionar Usuario" (onClose)="closeDialog()">
      @if (state().isloding) {
        <p>cargando....</p>
      } @else {
        <table-data
          [data]="users"
          [columns]="columns"
          [select]="true"
          [actions]="false"
          (onSelect)="handleActiveUser($event)"
        />
      }
    </dialog-layout>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelecUserComponent {
  #userStore = inject(UserStore);

  public headers = ['N°', 'Nombre', 'Email', 'Acciones'];
  public columns: KeysWithoutId<UserFull>[] = ['name', 'email'];

  public state = this.#userStore.state;
  public users = this.state().customers;

  constructor(private dialogRef: DialogRef<any>) {}

  closeDialog() {
    this.dialogRef.close(false);
  }

  handleActiveUser(user: UserFull) {
    this.dialogRef.close(user);
  }
}
