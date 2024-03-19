import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  AddRoleDto,
  AuthRegisterDto,
  User,
} from '../interfaces/auth.interface';
import {
  Customer,
  Employed,
  EmployedRoles,
  Rol,
  UpdateEmployedDto,
  UserFull,
} from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api`;

  getUsers() {
    return this.#http.get<UserFull[]>(`${this.#url}/users`);
  }

  getCustomers() {
    return this.#http.get<Customer[]>(`${this.#url}/users/customers`);
  }

  getEmployeesByRol(rol: Rol) {
    let params = new HttpParams();
    if (rol) params = params.append('rol', rol);

    return this.#http.get<Employed[]>(`${this.#url}/users/employees`, {
      params,
    });
  }

  createEmploye(dto: AuthRegisterDto) {
    return this.#http.post<Employed>(`${this.#url}/users/employe`, dto);
  }

  createCustomer(dto: AuthRegisterDto) {
    return this.#http.post<Customer>(`${this.#url}/users/customer`, dto);
  }

  update(idUser: string, dto: UpdateEmployedDto) {
    return this.#http.put<Employed>(`${this.#url}/users/update/${idUser}`, dto);
  }

  addRol(dto: AddRoleDto) {
    return this.#http.post<Rol[]>(`${this.#url}/users/asignar-rol`, dto);
  }

  removeRol(dto: AddRoleDto) {
    return this.#http.post<Rol[]>(`${this.#url}/users/remove-rol`, dto);
  }

  removeUser(id: string) {
    return this.#http.delete<{ id: string }>(`${this.#url}/users/${id}`);
  }
}
