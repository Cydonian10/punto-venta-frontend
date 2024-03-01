import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { User } from "../interfaces/auth.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api`;

  getUsers() {
    return this.#http.get<User[]>(`${this.#url}/users`)
  }
}