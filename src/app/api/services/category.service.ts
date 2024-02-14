import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ProductDto } from '../interfaces/products.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/category`;
  

  getCategories() {
    return this.#http.get<ProductDto[]>(`${this.#url}`)
  }

}
