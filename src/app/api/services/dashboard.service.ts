import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Dashboard } from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboarService {
  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/dashboard`;

  getDashsboard() {
    return this.#http.get<Dashboard>(`${this.#url}`);
  }
}
