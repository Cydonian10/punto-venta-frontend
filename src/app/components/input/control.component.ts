import { ControlErrorPipe } from '@/core/pipes/control-error.pipe';
import { JsonPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, input, signal } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [KeyValuePipe, ControlErrorPipe, JsonPipe],
  template: `
    <label [for]="label" class="block text-sm font-bold text-gray-700">
      {{ label }}
    </label>
    <ng-content />

  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlComponent {

  @Input() label: string = '';

  @Input() erros: { minl?: number; regex?: string } = {};


}
