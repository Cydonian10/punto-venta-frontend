import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CreateSaleDto, SaleDto } from '../interfaces/sale.interface';
import { checkToken } from '@/core/interceptors/token.interceptor';

@Injectable({ providedIn: 'root' })
export class SaleService {
  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/sales`;

  generateSale(dto: CreateSaleDto) {
    return this.#http.post(`${this.#url}`, dto, { context: checkToken() });
  }

  downloadFile(dto: CreateSaleDto) {
    return this.#http.post(`${this.#url}`, dto, {
      responseType: 'blob',
      context: checkToken(),
    });
  }

  mySales() {
    return this.#http.get<SaleDto[]>(`${this.#url}/my-sales`, {
      context: checkToken(),
    });
  }

  deleteSale(saleId: number, cashRegisterId: number) {
    return this.#http.delete<any>(
      `${this.#url}/${saleId}/caja/${cashRegisterId}`,
      { context: checkToken() },
    );
  }
}
