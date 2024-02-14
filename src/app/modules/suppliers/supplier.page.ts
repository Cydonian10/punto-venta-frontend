import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [],
  template: `
    <p>
      supplier works!
    </p>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SupplierPage {}