import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [],
  template: `
    <p>
      purchase works!
    </p>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PurchasePage {}