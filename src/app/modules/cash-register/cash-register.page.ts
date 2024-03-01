import { CashRegisterService } from '@/api/services/cash-register.service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CashItemComponent } from './components/cash-item.component';
import { CashRegisterDto } from '@/api/interfaces/cash-register.interface';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ConfirmComponent } from '@/components/confirm/confirm.component';
import { OpenCashComponent } from './components/open-cash.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { CartService } from '@/core/services/cart.service';
import { AlertService } from '@/core/services/alert.service';

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
        @for (cashitem of cashRegisters(); track $index) {
        <app-cash-item
          (onActiveCashRegister)="activaCashRegiser($event)"
          (onDialogClose)="close($event)"
          (onDialog)="open($event)"
          [dto]="cashitem"
          [cashActive]="cashActive()"
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
  #cashRegisterService = inject(CashRegisterService);
  #cartService = inject(CartService);
  #dialog = inject(Dialog);
  #alertService = inject(AlertService);

  public cashRegisters = signal<CashRegisterDto[]>([]);

  cashActive = this.#cartService.cashRegisterActive;

  ngOnInit(): void {
    this.#cashRegisterService.getCashRegister().subscribe((resp) => {
      this.cashRegisters.set(resp);
    });
  }

  open(id: number) {
    const dialogRef = this.#dialog.open(OpenCashComponent, {
      width: '100%',
      disableClose: true,
    });

    dialogRef.closed.subscribe((resp: any) => {
      if (resp) {
        this.#cashRegisterService
          .open(id, { initialCash: resp })
          .subscribe(() => {
            this.cashRegisters.update((x) =>
              x.map((x) => {
                if (x.id == id) {
                  x.initialCash = resp;
                  x.totalCash = resp;
                  x.open = true;
                }
                return x;
              })
            );
          });
      }
    });
  }

  openDiloagCrear() {}

  close(id: number) {
    if (this.#cartService.cashRegisterActive()!.id !== id) {
      this.#alertService.showAlertError('NO es tu caja');
      return;
    }

    const dialogRef = this.#dialog.open(ConfirmComponent, {
      width: '100%',
      data: { titulo: 'Estas seguro de cerrar caja' },
      disableClose: true,
    });

    dialogRef.closed.subscribe((resp: any) => {
      if (resp) {
        this.#cashRegisterService.close(id).subscribe(() => {
          this.cashRegisters.update((x) =>
            x.map((x) => {
              if (x.id == id) {
                x.open = false;
              }
              return x;
            })
          );
          this.#cartService.activeCashRegister(null);
          this.#alertService.showAlertSuccess('Caja Cerrada con exito');
        });
      }
    });
  }

  activaCashRegiser(value: CashRegisterDto) {
    if (value.open == false) {
      return;
    }
    this.#cartService.activeCashRegister(value);
    this.#alertService.showAlertSuccess('Caja activada ' + value.name);
  }
}
