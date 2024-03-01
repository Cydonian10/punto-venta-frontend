import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { PurchaseCrearDto } from '../interfaces/purchase.interface';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/purchases`;

  generatePurchase(dto: PurchaseCrearDto) {
    return this.#http.post(`${this.#url}`, dto);
  }
}
