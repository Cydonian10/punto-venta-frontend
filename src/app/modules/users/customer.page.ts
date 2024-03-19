import { Customer } from '@/api/interfaces/user.interface';
import { TableDataComponent } from '@/components/table/table-data.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { UserStore } from '@/core/store/user.store';
import { Dialog } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CreateCustomerComponent } from './components/create-customer.component';
import { ConfirmComponent } from '@/components/confirm/confirm.component';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [TableDataComponent, TitleCreateComponent],
  template: `
    <app-title-create
      title="Clientes"
      (onOpenDialog)="openCreateCustomer()"
    ></app-title-create>

    <table-data
      [columns]="colums"
      [data]="userState().customers"
      (onUpdate)="openCreateCustomer($event)"
      (onDelete)="handleDelete($event)"
    />
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CustomerPage implements OnInit {
  #userStore = inject(UserStore);
  #dialog = inject(Dialog);

  userState = this.#userStore.state;

  colums = ['name', 'email'];

  ngOnInit(): void {
    this.#userStore.getCustomers();
  }

  openCreateCustomer(data?: Customer) {
    this.#dialog.open(CreateCustomerComponent, {
      width: '600px',
      backdropClass: 'bg-black/60',
      disableClose: true,
      data,
    });
  }

  handleUpdate(value: Customer) {
    console.log(value);
  }

  handleDelete(value: Customer) {
    this.#dialog
      .open(ConfirmComponent, {
        width: '600px',
        backdropClass: 'bg-black/60',
        disableClose: true,
        data: { titulo: `Desea eliminar a ${value.name}` },
      })
      .closed.subscribe((resp: any) => {
        if (resp) {
          this.#userStore.deleteCustomer(value.id);
        }
      });
  }
}
