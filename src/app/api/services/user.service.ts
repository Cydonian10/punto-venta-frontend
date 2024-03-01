import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { RoleAsignarDto, User } from '../interfaces/auth.interface';
import { UserFull } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api`;

  getUsers() {
    return this.#http.get<UserFull[]>(`${this.#url}/users`);
  }

  addRol(dto: RoleAsignarDto) {
    return this.#http.post(`${this.#url}/users/asignar-rol`, dto);
  }

  removeRol(dto: RoleAsignarDto) {
    return this.#http.post(`${this.#url}/users/remove-rol`, dto);
  }
}
