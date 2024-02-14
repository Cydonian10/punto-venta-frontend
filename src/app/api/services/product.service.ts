import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ProductDto } from '../interfaces/products.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/products`;
  

  getProduct() {
    return this.#http.get<ProductDto[]>(`${this.#url}`)
  }

}
