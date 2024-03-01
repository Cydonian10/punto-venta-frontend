import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
  signal,
} from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-filter',
  standalone: true,
  imports: [OverlayModule, ReactiveFormsModule],
  template: `
    <button
      (click)="open()"
      type="button"
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      class="btn btn-secondary py-2 px-4"
    >
      Filter Menu
    </button>

    <!-- This template displays the overlay content and is connected to the button -->
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayOffsetY]="10"
      [cdkConnectedOverlayOffsetX]="-200"
    >
      <div class="bg-white p-5 shadow-2xl rounded-lg w-[230px]">
        <form class="space-y-2" [formGroup]="form" (submit)="aplicarFiltro()">
          <input
            formControlName="name"
            type="text"
            placeholder="Nombre"
            class="py-1.5 px-2 input"
          />
          <input
            formControlName="stock"
            type="number"
            placeholder="Stock"
            class="py-1.5 px-2 input"
          />
          <input
            formControlName="price"
            type="number"
            placeholder="Precio"
            class="py-1.5 px-2 input"
          />
          <div class="flex items-start justify-end gap-2">
            <button
              (click)="quitarFiltro()"
              type="button"
              class="btn-ghost ghost-danger py-1.5 px-3"
            >
              Quitar
            </button>
            <button class="btn-ghost ghost-primary py-1.5 px-3">Aplicar</button>
          </div>
        </form>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFilterComponent {
  #fb = inject(FormBuilder);

  public form = this.#fb.nonNullable.group({
    name: new FormControl(),
    stock: new FormControl(),
    price: new FormControl(),
  });

  public isOpen = signal(false);

  @Output() onAplicarFiltro = new EventEmitter();
  @Output() onQuitarFiltro = new EventEmitter();

  open() {
    this.isOpen.update((val) => !val);
  }

  aplicarFiltro() {
    this.onAplicarFiltro.emit(this.form.getRawValue());
  }

  quitarFiltro() {
    this.form.patchValue({
      name: null,
      stock: null,
      price: null,
    });
    this.onQuitarFiltro.emit({
      name: null,
      stock: null,
      price: null,
    });
  }
}
