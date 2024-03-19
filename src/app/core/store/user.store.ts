import {
  AddRoleDto,
  AuthLoginDto,
  AuthRegisterDto,
  AuthUser,
} from '@/api/interfaces/auth.interface';
import {
  Customer,
  Employed,
  Rol,
  UpdateEmployedDto,
} from '@/api/interfaces/user.interface';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { AuthService } from '@/api/services/auth.service';
import { UserService } from '@/api/services/user.service';

type UserState = {
  customers: Customer[];
  employees: Employed[];
  isloding: boolean;
  userActive: AuthUser | null;
};

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  #authSrv = inject(AuthService);
  #userSrv = inject(UserService);
  #alertSrv = inject(AlertService);

  #state = signal<UserState>({
    customers: [],
    employees: [],
    isloding: false,
    userActive: null,
  });

  state = computed(() => this.#state());

  constructor() {
    // effect(() => {
    //   console.log('Mi state de user store =>', this.#state());
    // });
  }

  login(dto: AuthLoginDto) {
    this.#state.update((state) => ({ ...state, isloding: true }));
    this.#authSrv.login(dto).subscribe({
      next: (user: AuthUser) => {
        this.#state.update((state) => ({ ...state, userActive: user })),
          this.#alertSrv.showAlertSuccess('Inicio de Sesion Correctamente');
      },
      error: (err) => {
        console.log('[User Store] 😡 Inicio de session error 💥💥', err);
        this.#alertSrv.showAlertError('Error al iniciar Sesion');
      },
      complete: () =>
        this.#state.update((state) => ({ ...state, isloding: false })),
    });
  }

  getCustomers() {
    this.#state.update((state) => ({ ...state, isloding: true }));
    this.#userSrv.getCustomers().subscribe({
      next: (customers: Customer[]) =>
        this.#state.update((state) => ({ ...state, customers })),
      error: (err) => {
        console.log('[Error User Store] 😡 Obtener Clientes 💥💥', err);
        this.#alertSrv.showAlertError('Error al iniciar Sesion');
      },
      complete: () =>
        this.#state.update((state) => ({ ...state, isloding: false })),
    });
  }

  getEmployees(rol: Rol) {
    this.#state.update((state) => ({ ...state, isloding: true }));
    this.#userSrv.getEmployeesByRol(rol).subscribe({
      next: (employees: Employed[]) =>
        this.#state.update((state) => ({ ...state, employees })),
      error: (err) => {
        console.log('[Error User Store] 😡 Obtener Employees 💥💥', err);
        this.#alertSrv.showAlertError('Error al iniciar Sesion');
      },
      complete: () =>
        this.#state.update((state) => ({ ...state, isloding: false })),
    });
  }

  removeRol(dto: AddRoleDto) {
    this.#state.update((state) => ({ ...state, isloding: true }));
    this.#userSrv.removeRol(dto).subscribe({
      next: (roles) => {
        this.#alertSrv.showAlertSuccess('Agregado con exito');
        this.#state.update((state) => ({
          ...state,
          employees: state.employees.map((employed) => {
            if (employed.email === dto.email) {
              employed.roles = roles;
            }
            return employed;
          }),
        }));
      },
      error: (err) => {
        console.log('[Error User Store] 😡 Agregar rol 💥💥', err);
        this.#alertSrv.showAlertError('Error al iniciar Sesion');
      },
      complete: () =>
        this.#state.update((state) => ({ ...state, isloding: false })),
    });
  }

  addRol(dto: AddRoleDto) {
    this.#state.update((state) => ({ ...state, isloding: true }));
    this.#userSrv.addRol(dto).subscribe({
      next: (roles) => {
        this.#alertSrv.showAlertSuccess('Agregado con exito');
        this.#state.update((state) => ({
          ...state,
          employees: state.employees.map((employed) => {
            if (employed.email === dto.email) {
              employed.roles = roles;
            }
            return employed;
          }),
        }));
      },
      error: (err) => {
        console.log('[Error User Store] 😡 Agregar rol 💥💥', err);
        this.#alertSrv.showAlertError('Error al iniciar Sesion');
      },
      complete: () =>
        this.#state.update((state) => ({ ...state, isloding: false })),
    });
  }

  createEmploye(dto: AuthRegisterDto) {
    this.#state.update((state) => ({ ...state, isloding: true }));
    this.#userSrv.createEmploye(dto).subscribe({
      next: (employe: Employed) => {
        this.#state.update((state) => ({
          ...state,
          employees: [employe, ...state.employees],
        }));
        this.#alertSrv.showAlertSuccess('Empleado Creado Exitosamente');
      },
      error: (err) => {
        console.log('[Error User Store] 😡 error asl crear empleado💥💥', err);
        this.#alertSrv.showAlertError('Error al crear empleado');
      },
      complete: () =>
        this.#state.update((state) => ({ ...state, isloding: false })),
    });
  }

  createCustomer(dto: AuthRegisterDto) {
    this.#state.update((state) => ({ ...state, isloding: true }));
    this.#userSrv.createCustomer(dto).subscribe({
      next: (customer: Customer) => {
        this.#state.update((state) => ({
          ...state,
          customers: [customer, ...state.customers],
        }));
        this.#alertSrv.showAlertSuccess('Cliente Creado Exitosamente');
      },
      error: (err) => {
        console.log('[Error User Store] 😡 error asl crear cliente 💥💥', err);
        this.#alertSrv.showAlertError('Error al crear cliente');
      },
      complete: () =>
        this.#state.update((state) => ({ ...state, isloding: false })),
    });
  }

  updateUser(id: string, dto: UpdateEmployedDto) {
    this.#state.update((state) => ({ ...state, isloding: true }));
    this.#userSrv.update(id, dto).subscribe({
      next: (resp) => {
        this.#alertSrv.showAlertSuccess('Agregado con exito');
        this.#state.update((state) => ({
          ...state,
          employees: state.employees.map((employed) => {
            if (employed.id === id) {
              employed = { ...employed, ...resp };
            }
            return employed;
          }),
        }));
      },
      error: (err) => {
        console.log('[Error User Store] 😡 Actulizar Usuario Error 💥💥', err);
        this.#alertSrv.showAlertError('Error al actulizar rol');
      },
      complete: () =>
        this.#state.update((state) => ({ ...state, isloding: false })),
    });
  }

  updateCliente(id: string, dto: UpdateEmployedDto) {
    this.#state.update((state) => ({ ...state, isloding: true }));
    this.#userSrv.update(id, dto).subscribe({
      next: (resp) => {
        this.#alertSrv.showAlertSuccess('Agregado con exito');
        this.#state.update((state) => ({
          ...state,
          customers: state.customers.map((customer) => {
            if (customer.id === id) {
              customer = { ...customer, ...resp };
            }
            return customer;
          }),
        }));
      },
      error: (err) => {
        console.log('[Error User Store] 😡 Actulizar Usuario Error 💥💥', err);
        this.#alertSrv.showAlertError('Error al actulizar rol');
      },
      complete: () =>
        this.#state.update((state) => ({ ...state, isloding: false })),
    });
  }

  deleteEmployee(idUser: string) {
    this.#state.update((state) => ({ ...state, isloding: true }));
    this.#userSrv.removeUser(idUser).subscribe({
      next: ({ id }) => {
        this.#alertSrv.showAlertSuccess('Usuario eliminado');
        this.#state.update((state) => ({
          ...state,
          employees: state.employees.filter((employe) => employe.id !== id),
        }));
      },
      error: (err) => {
        console.log('[Error User Store] 😡 Remover Usuario 💥💥', err);
        this.#alertSrv.showAlertError('Error al eliminar usuario');
      },
      complete: () =>
        this.#state.update((state) => ({ ...state, isloding: false })),
    });
  }

  deleteCustomer(idUser: string) {
    this.#state.update((state) => ({ ...state, isloding: true }));
    this.#userSrv.removeUser(idUser).subscribe({
      next: ({ id }) => {
        this.#alertSrv.showAlertSuccess('Usuario eliminado');
        this.#state.update((state) => ({
          ...state,
          customers: state.customers.filter((customer) => customer.id !== id),
        }));
      },
      error: (err) => {
        console.log('[Error User Store] 😡 Remover Usuario 💥💥', err);
        this.#alertSrv.showAlertError('Error al eliminar usuario');
      },
      complete: () =>
        this.#state.update((state) => ({ ...state, isloding: false })),
    });
  }
}
