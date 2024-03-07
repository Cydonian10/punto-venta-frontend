import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { TitleCreateComponent } from '../../components/title/title-create.component';
import { TableComponent } from '@/components/table/table.component';
import { UserService } from '@/api/services/user.service';
import { UserFull } from '@/api/interfaces/user.interface';
import { AddRolComponent } from './components/add-rol/add-rol.component';
import { RoleAsignarDto } from '@/api/interfaces/auth.interface';
import { MenuLayout } from '@/layouts/menu/menu.layout';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    DialogLayout,
    TitleCreateComponent,
    TableComponent,
    AddRolComponent,
    MenuLayout,
  ],
  template: `
    <div class="entrada">
      <app-title-create title="Manejo de Usuarios"> </app-title-create>
      <app-table [header]="headers">
        @for (user of users(); track user.id) {
        <tr class="hover:bg-gray-100 transition-all">
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ $index + 1 }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ user.name }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ user.salary }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ user.age }}
          </td>
          <td
            class="whitespace-nowrap px-4 py-2 text-gray-700 flex flex-col gap-1 items-start"
          >
            <div class="flex gap-3">
              @for (rol of user.roles; track $index) {
              <div class="flex gap-2 items-center justify-between ">
                <span>{{ rol }}</span>
                <button
                  (click)="handleRemoveRole(rol, user.email)"
                  class="btn-icon btn-icon-danger py-1 px-2"
                >
                  -
                </button>
              </div>
              }
            </div>
            <menu-layout text="+">
              <app-add-rol
                [user]="user"
                (onSubmitRole)="handleSubmitRole($event, user.email)"
              />
            </menu-layout>
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            @for (claims of user.claims; track $index) {
            <span>{{ claims }}</span>
            }
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            <button class="btn-icon btn-icon-primary px-2 py-1">
              <i class="bx bxs-add-to-queue"></i>
            </button>
          </td>
        </tr>
        }
      </app-table>
    </div>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserPage implements OnInit {
  #userService = inject(UserService);

  public headers = [
    'N°',
    'Nombre',
    'Salario',
    'Edad',
    'Roles',
    'Claims',
    'Acciones',
  ];
  public users = signal<UserFull[]>([]);

  ngOnInit(): void {
    this.#userService.getUsers().subscribe((resp) => {
      this.users.set(resp);
    });
  }

  handleSubmitRole(roles: string[], email: string) {
    this.#userService.addRol({ email, roles }).subscribe(() => {
      this.users.update((x) =>
        x.map((y) => {
          if (y.email === email) {
            y.roles = roles;
          }
          return y;
        })
      );
    });
  }

  handleRemoveRole(rol: string, email: string) {
    const roles = [rol];
    const data = { email, roles };
    this.#userService.removeRol(data).subscribe(() => {
      this.users.update((x) =>
        x.map((y) => {
          if (y.email == email) {
            y.roles = y.roles.filter((item) => item !== rol);
          }
          return y;
        })
      );
    });
  }
}
