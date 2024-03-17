import { CashRegisterService } from '@/api/services/cash-register.service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CashItemComponent } from './components/cash-item.component';
import {
  CashRegisterDto,
  CreateCashRegisterDto,
} from '@/api/interfaces/cash-register.interface';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ConfirmComponent } from '@/components/confirm/confirm.component';
import { OpenCashComponent } from './components/open-cash.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { CartService } from '@/core/services/cart.service';
import { AlertService } from '@/core/services/alert.service';
import { CreateCashRegisterComponent } from './components/create-cash-register.component';
import { AuthService } from '@/api/services/auth.service';
import { Router } from '@angular/router';
import { CashRegisterStore } from '@/core/store/cash-register.store';

@Component({
  selector: 'app-cash-register',
  standalone: true,
  imports: [CashItemComponent, DialogModule, TitleCreateComponent],
  template: `
    <div class="entrada">
      <app-title-create
        title="Cajas Registradoras"
        (onOpenDialog)="openDiloagCrear()"
      >
      </app-title-create>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        @for (cashitem of cashRegisterState().listCashRegister; track $index) {
          <app-cash-item
            (onActiveCashRegister)="activaCashRegiser($event)"
            (onDialogClose)="close($event)"
            (onDialog)="open($event)"
            [dto]="cashitem"
          />
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CashRegisterPage implements OnInit {
  #user = inject(AuthService).user();
  #cartService = inject(CartService);
  #dialog = inject(Dialog);
  #alertService = inject(AlertService);
  #router = inject(Router);
  #cashRegisterStore = inject(CashRegisterStore);

  public cashRegisterState = this.#cashRegisterStore.state;

  ngOnInit(): void {}

  open(id: number) {
    const dialogRef = this.#dialog.open(OpenCashComponent, {
      width: '400px',
      backdropClass: 'bg-black/50',
      disableClose: true,
    });

    dialogRef.closed.subscribe((resp: any) => {
      if (resp) {
        this.#cashRegisterStore.openCashRegister(id, { initialCash: resp });
      }
    });
  }

  openDiloagCrear() {
    this.#dialog
      .open(CreateCashRegisterComponent, {
        width: '400px',
        backdropClass: 'bg-black/50',
        disableClose: true,
      })
      .closed.subscribe((resp: any) => {
        if (resp) {
          this.#cashRegisterStore.addCashRegister(resp);
        }
      });
  }

  close(id: number) {
    this.#dialog
      .open(ConfirmComponent, {
        width: '400px',
        data: { titulo: 'Estas seguro de cerrar caja' },
        disableClose: true,
      })
      .closed.subscribe((resp: any) => {
        if (resp) {
          this.#cashRegisterStore.closeCashRegister(id);
        }
      });
  }

  activaCashRegiser(value: CashRegisterDto) {
    this.#cashRegisterStore.updateCashRegister(value.id, {
      name: value.name!,
      userId: null,
    });
  }
}
