import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { AddRoleDto, User } from '../interfaces/auth.interface';
import {
  Customer,
  Employed,
  Rol,
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

  addRol(dto: AddRoleDto) {
    return this.#http.post(`${this.#url}/users/asignar-rol`, dto);
  }

  getCustomers() {
    return this.#http.get<Customer[]>(`${this.#url}/customers`);
  }

  getEmployeesByRol(rol: Rol) {
    let params = new HttpParams();
    if (rol) params = params.append('rol', rol);

    return this.#http.get<Employed[]>(`${this.#http}/employees`, { params });
  }

  removeRol(dto: AddRoleDto) {
    return this.#http.post(`${this.#url}/users/remove-rol`, dto);
  }
}
