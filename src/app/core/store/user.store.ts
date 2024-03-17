import {
  AddRoleDto,
  AuthLoginDto,
  AuthUser,
} from '@/api/interfaces/auth.interface';
import { Customer, Employed, Rol } from '@/api/interfaces/user.interface';
import { Injectable, inject, signal } from '@angular/core';
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
      next: () => {
        this.#alertSrv.showAlertSuccess('Agregado con exito');
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
      next: () => {
        this.#alertSrv.showAlertSuccess('Agregado con exito');
      },
      error: (err) => {
        console.log('[Error User Store] 😡 Agregar rol 💥💥', err);
        this.#alertSrv.showAlertError('Error al iniciar Sesion');
      },
      complete: () =>
        this.#state.update((state) => ({ ...state, isloding: false })),
    });
  }
}
