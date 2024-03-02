import { OverlayModule } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
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
        class="py-4 px-7  shadow-lg border shadow-indigo-500/40 bg-white rounded-md"
      >
        <ng-content />
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

  @Output() onMenuClose = new EventEmitter();

  toogle() {
    this.open.update((x) => !x);
  }
}
