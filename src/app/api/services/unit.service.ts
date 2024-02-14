import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { UnitCrearDto, UnitDto, UnitUpdateDto } from '../interfaces/unit.interface';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/unit`;
  

  getUnits() {
    return this.#http.get<UnitDto[]>(`${this.#url}`)
  }

  crearUnit(data:UnitCrearDto) {
    return this.#http.post(`${this.#url}`, data)
  }

  updateUnit(data:UnitUpdateDto,id:number) {
    return this.#http.put(`${this.#url}/${id}`, data)
  }

  deleteUnit(id:number) {
    return this.#http.delete(`${this.#url}/${id}`)
  }
}
