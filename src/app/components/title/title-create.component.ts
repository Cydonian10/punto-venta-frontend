import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-title-create',
  standalone: true,
  template: `
    <div
      class="block md:flex md:items-center md:justify-between mb-5 print:hidden"
    >
      <h3
        class="relative text-xl lg:text-3xl font-semibold py-4 tracking-[4px] before:absolute before:w-28 before:h-[3px] before:bg-gray-900 before:left-0 before:bottom-0 mb-4"
      >
        {{ title }}
      </h3>
      <div class="flex gap-4 items-center">
        <ng-content></ng-content>
        <button
          class="btn btn-primary animation-btn btn-sm md:btn-md"
          (click)="openDialog()"
        >
          {{ buttonText }}
        </button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [InputComponent],
})
export class TitleCreateComponent {
  @Input() title: string = '';
  @Input() buttonText: string = 'Crear';

  @Output() onOpenDialog = new EventEmitter();

  openDialog() {
    this.onOpenDialog.emit();
  }
}
