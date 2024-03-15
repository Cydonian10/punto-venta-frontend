import { AuthUser, User } from '@/api/interfaces/auth.interface';
import { CashRegisterDto } from '@/api/interfaces/cash-register.interface';
import { AlertService } from '@/core/services/alert.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';

@Component({
  selector: 'cash-register-active',
  standalone: true,
  imports: [OverlayModule, TitleCasePipe],
  template: `
    <button
      (click)="handleOpen()"
      type="button"
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      class="btn btn-secondary btn-sm sm:btn-md"
    >
      Selecionar Caja
    </button>

    <!-- This template displays the overlay content and is connected to the button -->
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayOffsetY]="10"
      (overlayOutsideClick)="handleOpen()"
    >
      <div class="bg-white p-5 rounded-lg shadow-lg space-y-2">
        @for (cashRegister of cashRegisters; track $index) {
          <div class="flex items-center gap-3">
            <p class="font-bold">{{ cashRegister.name | titlecase }}</p>
            <p>{{ cashRegister.open ? '✅' : '❎' }}</p>
            @if (!cashRegister.userId) {
              <button
                (click)="handleSelectCashRegister(cashRegister)"
                class="btn btn-secondary btn-sm"
              >
                Activar
              </button>
            }
            @if (user.usuario.id === cashRegister.userId) {
              <button
                (click)="handleCloseCashRegister(cashRegister.id)"
                class="btn btn-danger btn-sm"
              >
                Cerrar
              </button>
            }
          </div>
        } @empty {
          <p>...loging</p>
        }
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashRegisterActiveComponent {
  #alertService = inject(AlertService);

  @Input({ required: true }) cashRegisters: CashRegisterDto[] = [];
  @Input() user!: AuthUser;

  @Output() onSelectCashRegister = new EventEmitter();
  @Output() onCloseCashRegister = new EventEmitter();

  public open = signal<boolean>(false);

  public handleOpen() {
    this.open.update((current: boolean) => !current);
  }

  handleSelectCashRegister(value: CashRegisterDto) {
    if (value.userId) {
      this.#alertService.showAlertError('No lo puedes activar');
      return;
    }

    if (!value.open) {
      this.#alertService.showAlertError('No lo puedes activar');
      return;
    }

    this.onSelectCashRegister.emit(value);
  }

  handleCloseCashRegister(id: number) {
    this.onCloseCashRegister.emit(id);
  }
}
