import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cash-register',
  standalone: true,
  imports: [],
  template: `
    <p>
      cash-register works!
    </p>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CashRegisterPage {}