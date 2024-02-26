import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ProductCrearDto, ProductDto } from '../interfaces/products.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/products`;
  

  getProduct() {
    return this.#http.get<ProductDto[]>(`${this.#url}`)
  }

  crearProduct(data:ProductCrearDto) {
    return this.#http.post(`${this.#url}`,data)
  }

  updateProduct(data:ProductCrearDto,id:number) {
    return this.#http.put(`${this.#url}/${id}`,data)
  }

  deleteProduct(id:number) {
    return this.#http.delete(`${this.#url}/${id}`)
  }
}
