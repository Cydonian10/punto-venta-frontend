import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  FilterProductDto,
  HistoryProductPrice,
  ProductCrearDto,
  ProductDto,
  ProductsResposne,
} from '../interfaces/products.interface';
import { PageDto } from '../interfaces/page.interface';
import { forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/products`;

  getProduct(pagination?: PageDto) {
    let params = new HttpParams();
    if (pagination) {
      params = params.append('page', pagination.page);
      params = params.append(
        'quantityRecordsPerPage',
        pagination.quantityRecordsPerPage,
      );
    }
    return this.#http.get<ProductsResposne>(`${this.#url}`, { params });
  }

  getFilter(filter: FilterProductDto) {
    let params = new HttpParams();
    if (filter.name) params = params.append('name', filter.name);
    if (filter.price) params = params.append('price', filter.price);
    if (filter.stock) params = params.append('stock', filter.stock);
    if (filter.barCode) params = params.append('barCode', filter.barCode);

    return this.#http.get<ProductDto[]>(`${this.#url}/filter`, { params });
  }

  crearProduct(data: ProductCrearDto) {
    return this.#http.post(`${this.#url}`, data);
  }

  updateProduct(data: ProductCrearDto, id: number) {
    return this.#http.put(`${this.#url}/${id}`, data);
  }

  deleteProduct(id: number) {
    return this.#http.delete(`${this.#url}/${id}`);
  }

  getHistoryProductPrice(id: number) {
    return this.#http.get<HistoryProductPrice[]>(`${this.#url}/history/${id}`);
  }

  updateSalePrice(price: number, id: number) {
    const pathOperation = [{ path: '/salePrice', op: 'replace', value: price }];

    return this.#http.patch(`${this.#url}/${id}`, pathOperation);
  }

  generateQrCode(data: string) {
    return this.#http
      .get(`${environment.apiUrl}/api/bardCode?data=${data}`, {
        responseType: 'text',
      })
      .pipe(map((resp) => 'data:image/png;base64,' + resp));
  }

  createUsers(values: string[]) {
    const requests = values.map((name) => this.generateQrCode(name));
    return forkJoin(requests);
  }
}
