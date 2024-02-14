import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-title-create',
  standalone: true,
  imports: [],
  template: `
    <div class="flex items-center justify-between mb-5">
       <h3 class="relative text-3xl font-semibold py-4 tracking-[4px] before:absolute before:w-28 before:h-[3px] before:bg-gray-900 before:left-0 before:bottom-0 mb-2">
        {{title}}
      </h3>
      <button class="btn btn-primary animation-btn" (click)="openDialog()">Crear</button>
    </div>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleCreateComponent {
  @Input() title:string = ""

  @Output() onOpenDialog = new EventEmitter();

  openDialog() {
    this.onOpenDialog.emit()
  }
}