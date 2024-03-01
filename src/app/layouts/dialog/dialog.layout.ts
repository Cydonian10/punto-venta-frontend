import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'dialog-layout',
  standalone: true,
  imports: [],
  template: `
    <div
      class="shadow-lg rounded-md relative bg-white p-10 w-9/12 lg:w-6/12 m-auto  outline-none"
    >
      <button
        (click)="closeDialog()"
        class="absolute top-10 right-10 hover:bg-gray-400 p-1 rounded-md hover:text-white"
      >
        <i class="bx bx-window-close text-2xl"></i>
      </button>
      <h3 class="font-bold text-2xl mb-4">{{ title }}</h3>
      <ng-content></ng-content>
    </div>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogLayout {
  @Input() title = '';
  @Output() onClose = new EventEmitter();

  closeDialog() {
    this.onClose.emit();
  }
}
