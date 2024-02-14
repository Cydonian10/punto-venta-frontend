import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CategoryCrearDto, CategoryDto, CategoryUpdateDto } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/category`;
  

  getCategories() {
    return this.#http.get<CategoryDto[]>(`${this.#url}`)
  }

  crearCategory(data:CategoryCrearDto) {
    return this.#http.post(`${this.#url}`, data)
  }

  updateCategory(data:CategoryUpdateDto,id:number) {
    return this.#http.put(`${this.#url}/${id}`,data)
  }

  deleteCategory(id:number) {
    return this.#http.delete(`${this.#url}/${id}`)
  }
}
