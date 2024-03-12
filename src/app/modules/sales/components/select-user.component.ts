import { UserFull } from '@/api/interfaces/user.interface';
import { UserService } from '@/api/services/user.service';
import { TableDataComponent } from '@/components/table/table-data.component';
import { TableComponent } from '@/components/table/table.component';
import { KeysWithoutId } from '@/helpers/toTable';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-selec-user',
  standalone: true,
  imports: [DialogLayout, TableComponent, TableDataComponent],
  template: `
    <dialog-layout title="Selecionar Usuario" (onClose)="closeDialog()">
      <table-data
        [data]="users()"
        [columns]="columns"
        [select]="true"
        [actions]="false"
        (onSelect)="handleActiveUser($event)"
      />
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
  #userService = inject(UserService);

  public headers = ['N°', 'Nombre', 'Email', 'Acciones'];
  public columns: KeysWithoutId<UserFull>[] = ['name', 'email'];
  public users = signal<UserFull[]>([]);

  constructor(private dialogRef: DialogRef<any>) {}

  ngOnInit() {
    this.#userService.getUsers().subscribe((resp) => {
      this.users.set(resp);
    });
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  handleActiveUser(user: UserFull) {
    this.dialogRef.close(user);
  }
}
