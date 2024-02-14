import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [],
  template: `
    <p>
      sale works!
    </p>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SalePage {}