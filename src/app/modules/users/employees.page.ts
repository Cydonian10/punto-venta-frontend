import { Rol } from '@/api/interfaces/user.interface';
import { TableDataComponent } from '@/components/table/table-data.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { UserStore } from '@/core/store/user.store';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { UpdateEmployeeComponent } from './components/update-employee.component';
import { CreateEmployeComponent } from './components/create-employee.component';
import { ConfirmComponent } from '@/components/confirm/confirm.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [TableDataComponent, TitleCreateComponent, DialogModule],
  template: `
    <app-title-create
      title="Empleados"
      (onOpenDialog)="createEmployeed()"
    ></app-title-create>

    @if (userState().isloding) {
      <p>cargando</p>
    }

    <table-data
      [columns]="columns"
      [data]="userState().employees"
      (onDelete)="handleDelete($event)"
      (onUpdate)="handleUpdate($event)"
      (onHistory)="handleDetails($event)"
    />
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EmployeePage implements OnInit {
  #userStore = inject(UserStore);
  #dialog = inject(Dialog);

  rol = signal<Rol>(Rol.Empleado);
  userState = this.#userStore.state;
  columns = ['name', 'email', 'age', 'salary'];

  ngOnInit(): void {
    this.#userStore.getEmployees(this.rol());
  }

  createEmployeed() {
    this.#dialog.open(CreateEmployeComponent, {
      width: '600px',
      backdropClass: 'bg-black/60',
      disableClose: true,
    });
  }

  handleDelete(value: any) {
    this.#dialog
      .open(ConfirmComponent, {
        width: '400px',
        backdropClass: 'bg-black/60',
        data: { titulo: 'Desea eliminar usuario' },
        disableClose: true,
      })
      .closed.subscribe((resp) => {
        if (resp) {
          this.#userStore.deleteEmployee(value.id);
        }
      });
  }

  handleUpdate(value: any) {
    this.#dialog.open(UpdateEmployeeComponent, {
      width: '600px',
      backdropClass: 'bg-black/60',
      data: value,
      disableClose: true,
    });
  }

  handleDetails(value: any) {
    console.log(value);
  }
}
