import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CashRegisterDto } from '../../../api/interfaces/cash-register.interface';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cash-item',
  standalone: true,
  imports: [DatePipe, NgClass, RouterLink],
  template: `
    <div
      class="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-xl"
    >
      <span
        class="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"
      ></span>

      <div class="sm:flex sm:justify-between sm:gap-4">
        <div>
          <h3 class="text-lg font-bold text-gray-900 sm:text-xl">
            <a [routerLink]="['history', dto.id]"> {{ dto.name }}</a>
          </h3>
          <span class="text-[10px] font-bold">IdUser: {{ dto.userId }}</span>
          <p class="mt-1 text-xs font-medium text-gray-600">
            {{ dto.open ? 'Abierto' : 'Cerrado' }}
          </p>
        </div>

        @if (dto.open) {
          <button
            (click)="handleCloseDialog()"
            class="w-[60px] h-[60px] rounded-lg bg-green-500 active:scale-95 transition-transform"
          ></button>
        } @else {
          <button
            (click)="handleOpenDialog()"
            class="w-[60px] h-[60px] rounded-lg bg-red-500 active:scale-95 transition-transform"
          ></button>
        }
      </div>

      <dl class="mt-6 flex gap-4 sm:gap-6">
        <div class="flex flex-col-reverse">
          <dt class="text-sm font-medium text-gray-600">Monto Inicial</dt>
          <dd class="text-xs text-gray-500">{{ dto.initialCash }}</dd>
        </div>

        <div class="flex flex-col-reverse">
          <dt class="text-sm font-medium text-gray-600">Monto Final</dt>
          <dd class="text-xs text-gray-500">{{ dto.totalCash }}</dd>
        </div>
      </dl>

      @if (dto.userId) {
        <button
          class="btn-ghost ghost-primary absolute bottom-4 right-2 py-1 px-3 "
          (click)="handleActiveCashRegister()"
        >
          Remover
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashItemComponent {
  @Input() dto: CashRegisterDto = {
    id: 0,
    initialCash: 0,
    date: '',
    open: false,
    userId: null,
  };

  @Output() onDialog = new EventEmitter<number>();
  @Output() onDialogClose = new EventEmitter<number>();
  @Output() onActiveCashRegister = new EventEmitter<CashRegisterDto>();

  handleOpenDialog() {
    this.onDialog.emit(this.dto.id);
  }

  handleCloseDialog() {
    this.onDialogClose.emit(this.dto.id);
  }

  handleActiveCashRegister() {
    this.onActiveCashRegister.emit(this.dto);
  }
}
