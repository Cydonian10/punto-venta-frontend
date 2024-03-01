import { AuthUser, User } from '@/api/interfaces/auth.interface';
import { UserFull } from '@/api/interfaces/user.interface';
import { UserService } from '@/api/services/user.service';
import { TableComponent } from '@/components/table/table.component';
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
  imports: [DialogLayout, TableComponent],
  template: `
    <dialog-layout title="Selecionar Usuario" (onClose)="closeDialog()">
      <app-table [header]="headers">
        @for (user of users(); track user.id) {
        <tr class="hover:bg-gray-100 transition-all">
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ $index }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ user.name }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ user.email }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            <button
              (click)="handleActiveUser(user)"
              class="btn-icon btn-icon-primary px-2 py-1"
            >
              <i class="bx bxs-add-to-queue"></i>
            </button>
          </td>
        </tr>
        }
      </app-table>
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
