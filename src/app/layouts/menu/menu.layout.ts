import { Rol } from '@/api/interfaces/user.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  computed,
  input,
  model,
  signal,
} from '@angular/core';

@Component({
  selector: 'menu-layout',
  standalone: true,
  imports: [OverlayModule],
  template: `
    <button
      (click)="toogle()"
      type="button"
      cdkOverlayOrigin
      #trigger="cdkOverlayOrigin"
      class="btn-icon btn-icon-primary p-1 px-2"
    >
      {{ text }}
    </button>

    <!-- This template displays the overlay content and is connected to the button -->
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayOffsetY]="2"
      [cdkConnectedOverlayOffsetX]="25"
      (overlayOutsideClick)="toogle()"
    >
      <div
        class="py-4 px-7  shadow-lg border shadow-indigo-500/40 bg-white rounded-md w-[200px]"
      >
        <h3 class="text-sm font-bold text-center mb-3">Agrega un rol</h3>
        <form>
          @for (op of opciones; track $index) {
            <div>
              <label>
                <input
                  type="checkbox"
                  [checked]="selection.isSelected(op)"
                  (change)="selection.toggle(op)"
                />
                {{ op }}
              </label>
            </div>
          }

          <button
            (click)="this.onSubmitRole.emit(this.selection.selected)"
            class="btn-ghost ghost ghost-primary py-1.5 mt-4"
            type="button"
          >
            Enviar
          </button>
        </form>
      </div>
    </ng-template>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLayout {
  @Input() text: string = 'cambiar';
  public open = signal(false);

  toogle() {
    this.open.update((x) => !x);
    this.selection.clear();
  }

  selection = new SelectionModel<any>(true, []);

  @Output() onSubmitRole = new EventEmitter();

  opciones = Object.keys(Rol).map((key) => key);
}
