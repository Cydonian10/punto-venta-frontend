import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import {
  CashRegisterDto,
  CashRegisterHistoryDto,
  CreateCashRegisterDto,
} from '../interfaces/cash-register.interface';
import { checkToken } from '@/core/interceptors/token.interceptor';

@Injectable({ providedIn: 'root' })
export class CashRegisterService {
  #http = inject(HttpClient);
  #url = `${environment.apiUrl}/api/cash-registers`;

  getCashRegister() {
    return this.#http.get<CashRegisterDto[]>(`${this.#url}`);
  }

  create(dto: CreateCashRegisterDto) {
    return this.#http.post<CashRegisterDto>(`${this.#url}`, dto, {
      context: checkToken(),
    });
  }

  open(id: number, value: { initialCash: number }) {
    return this.#http.put(`${this.#url}/open/${id}`, value, {
      context: checkToken(),
    });
  }

  close(id: number) {
    return this.#http.put(
      `${this.#url}/close/${id}`,
      {},
      { context: checkToken() },
    );
  }

  activeRegisterCashWithUser(userId: string, id: number) {
    const pathOperation = [{ path: '/userId', op: 'replace', value: userId }];

    return this.#http.patch(`${this.#url}/${id}`, pathOperation, {
      context: checkToken(),
    });
  }

  getHistory(id: number) {
    return this.#http.get<CashRegisterHistoryDto[]>(
      `${this.#url}/history/${id}`,
    );
  }
}
