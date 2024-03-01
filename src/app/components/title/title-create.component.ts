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
    <div class="flex items-center justify-between mb-5 print:hidden">
      <h3
        class="relative text-xl lg:text-3xl font-semibold py-4 tracking-[4px] before:absolute before:w-28 before:h-[3px] before:bg-gray-900 before:left-0 before:bottom-0 mb-2"
      >
        {{ title }}
      </h3>
      <div class="flex gap-4 items-center">
        <ng-content></ng-content>
        <button
          class="btn btn-primary animation-btn py-1 px-3 md:py-2.5 text-sm md:text-base md:px-5"
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
