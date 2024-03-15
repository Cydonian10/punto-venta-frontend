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
      class="btn btn-secondary btn-sm sm:btn-md"
    >
      Filter Menu
    </button>

    <!-- This template displays the overlay content and is connected to the button -->
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="isOpen()"
      [cdkConnectedOverlayOffsetY]="10"
      (overlayOutsideClick)="open()"
    >
      <div
        class="bg-white p-5 shadow-2xl rounded-lg w-[200px] md:w-[350px] relative"
      >
        <button
          (click)="open()"
          class="absolute top-2 right-2 hover:bg-gray-400 p-1 rounded-md hover:text-white"
        >
          <i class="bx bx-window-close text-xl"></i>
        </button>
        <h3 class="font-bold text-sm mb-3 text-center">Filtros de busqueda</h3>
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
