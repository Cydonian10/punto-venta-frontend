import {
  CashRegisterDto,
  CreateCashRegisterDto,
  UpdateCashRegisterDto,
} from '@/api/interfaces/cash-register.interface';
import { CashRegisterService } from '@/api/services/cash-register.service';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { AlertService } from '../services/alert.service';

type cashRegisterState = {
  listCashRegister: CashRegisterDto[];
  isLoading: boolean;
  currentCashRegister: CashRegisterDto | null;
};

@Injectable({
  providedIn: 'root',
})
export class CashRegisterStore {
  #cashRegisterSrv = inject(CashRegisterService);
  #localStorageSrv = inject(LocalStorageService);
  #alertService = inject(AlertService);

  /** Inicial State */
  #state = signal<cashRegisterState>({
    listCashRegister: [],
    isLoading: false,
    currentCashRegister: null,
  });

  public state = computed(() => this.#state());

  /** Llamadas inciales */
  constructor() {
    this.getAll();
    this.loadCurrentCashRegister();

    effect(() => {
      this.#localStorageSrv.save<CashRegisterDto | null>(
        this.#state().currentCashRegister,
        'cashRegisterActive',
      );
    });
  }

  /** Metodos */

  loadCurrentCashRegister() {
    const cashActive =
      this.#localStorageSrv.get<CashRegisterDto>('cashRegisterActive');

    if (cashActive) {
      this.#state.update((s) => ({ ...s, currentCashRegister: cashActive }));
    }
  }

  getAll() {
    this.#state.update((s) => ({ ...s, isLoading: true }));
    this.#cashRegisterSrv.getCashRegister().subscribe({
      next: (resp) => {
        this.#state.update((s) => ({ ...s, listCashRegister: resp }));
      },
      error: (err) => console.log(err),
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  addCashRegister(dto: CreateCashRegisterDto) {
    this.#state.update((s) => ({ ...s, isLoading: true }));
    this.#cashRegisterSrv.create(dto).subscribe({
      next: (resp: CashRegisterDto) => {
        this.#state.update((s) => ({
          ...s,
          listCashRegister: [resp, ...s.listCashRegister],
        }));
      },
      error: (err) => console.log(err),
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  openCashRegister(id: number, dto: { initialCash: number }) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#cashRegisterSrv.open(id, dto).subscribe({
      next: () => {
        this.#state.update((s) => ({
          ...s,
          listCashRegister: s.listCashRegister.map((cr) => {
            if (cr.id === id) {
              cr.open = true;
              cr.initialCash = dto.initialCash;
              cr.totalCash = dto.initialCash;
            }
            return cr;
          }),
        }));
      },
      error: (err) => console.log(err),
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  closeCashRegister(id: number) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#cashRegisterSrv.close(id).subscribe({
      next: () => {
        this.#state.update((s) => ({
          ...s,
          currentCashRegister: null,
          listCashRegister: s.listCashRegister.map((cr) => {
            if (cr.id === id) {
              cr.open = false;
              cr.userId = null;
            }
            return cr;
          }),
        }));
      },
      error: (err) => console.log(err),
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });

    this.removeCurrectCashRegister();
  }

  activeRegisterCashWithUser(userId: string, cashId: number) {
    this.#state.update((s) => ({ ...s, isLoading: true }));

    this.#cashRegisterSrv.activeRegisterCashWithUser(userId, cashId).subscribe({
      next: () => {
        this.#state.update((s) => ({
          ...s,
          listCashRegister: s.listCashRegister.map((cr) => {
            if (cr.id === cashId) {
              cr.userId = userId;
            }
            return cr;
          }),
        }));
      },
      error: (err) => {
        this.#alertService.showAlertError(err.error.message);
      },
      complete: () => {
        this.#state.update((s) => ({ ...s, isLoading: false }));
      },
    });
  }

  updateTotalCashBeforePago(total: number) {
    this.#state.update((s) => ({
      ...s,
      listCashRegister: s.listCashRegister.map((cr) => {
        console.log(this.#state().currentCashRegister!.id);
        if (cr.id == this.#state().currentCashRegister!.id) {
          cr.totalCash = cr.totalCash! + total;
        }
        return cr;
      }),
    }));
  }

  updateCashRegister(cashRegisterId: number, dto: UpdateCashRegisterDto) {
    this.#cashRegisterSrv
      .updateCashRegister(cashRegisterId, dto)
      .subscribe((resp: CashRegisterDto) => {
        this.#state.update((s) => ({
          ...s,
          listCashRegister: s.listCashRegister.map((cr) => {
            if (cr.id === resp.id) {
              cr.userId = resp.userId;
              cr.name = resp.name;
            }
            return cr;
          }),
        }));
        this.#alertService.showAlertSuccess(
          'El usuario fue removido de la caja',
        );
      });
  }

  selectCurrectCashRegister(value: CashRegisterDto) {
    if (
      this.#state().currentCashRegister !== null ||
      this.#state().currentCashRegister?.open == false
    ) {
      this.#alertService.showAlertError(`Ya estas trabajando en ${value.name}`);
      return;
    }
    this.#state.update((s) => ({ ...s, currentCashRegister: value }));
  }

  removeCurrectCashRegister() {
    this.#state.update((s) => ({ ...s, currentCashRegister: null }));
  }
}
