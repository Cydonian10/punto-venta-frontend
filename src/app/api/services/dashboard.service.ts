import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Dashboard } from '../interfaces/dashboard.interface';
import { checkToken } from '@/core/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root',
})
export class DashboarService {
  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/dashboard`;

  getDashsboard() {
    return this.#http.get<Dashboard>(`${this.#url}`, { context: checkToken() });
  }
}
