import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { UnitDto } from '../interfaces/unit.interface';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  #http = inject(HttpClient);

  #url = `${environment.apiUrl}/api/unit`;
  

  getUnits() {
    return this.#http.get<UnitDto[]>(`${this.#url}`)
  }
}
