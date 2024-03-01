import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  CreateSupplierDto,
  SupplierDto,
} from '../interfaces/suppliers.interface';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/suppliers`;

  getSuppliers() {
    return this.#http.get<SupplierDto[]>(`${this.#url}`);
  }

  create(dto: CreateSupplierDto) {
    return this.#http.post(`${this.#url}`, dto);
  }

  update(dto: CreateSupplierDto) {
    return this.#http.put(`${this.#url}`, dto);
  }
}
