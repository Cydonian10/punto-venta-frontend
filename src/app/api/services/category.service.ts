import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CreateCategoryDto, CategoryDto, UpdateCategoryDto } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/categories`;

  filterByName(name: string) {

    const params = new HttpParams().set('name',name)

    return this.#http.get<CategoryDto[]>(`${this.#url}/filter`, { params })
  }

  getCategories() {
    return this.#http.get<CategoryDto[]>(`${this.#url}`)
  }

  crearCategory(data:CreateCategoryDto) {
    return this.#http.post(`${this.#url}`, data)
  }

  updateCategory(data:UpdateCategoryDto,id:number) {
    return this.#http.put(`${this.#url}/${id}`,data)
  }

  deleteCategory(id:number) {
    return this.#http.delete(`${this.#url}/${id}`)
  }
}
