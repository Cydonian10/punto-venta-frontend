import { Alert } from '@/core/interfaces/ui.interface';
import { AlertService } from '@/core/services/alert.service';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  template: `
    <div class="w-full flex items-center justify-center ">
      <div
        class="fixed z-50 top-10 flex bg-slate-800 shadow-2xl rounded-lg caja w-[400px]"
      >
        <button
          class="absolute top-2 right-5 btn-icon btn-icon-white py-1 px-2"
          (click)="closeAlert()"
        >
          <i class="bx bx-window-close"></i>
        </button>
        <div
          [class]="alerts.color"
          class="icon flex justify-center items-center p-6 rounded-tr-3xl rounded-lg"
        >
          <div
            [class]="alerts.text"
            class="h-8 w-8 bg-white rounded-full flex items-center justify-center"
          >
            <i [class]="alerts.icon"></i>
          </div>
        </div>
        <div
          class="flex items-center justify-between w-full gap-3 p-4 rounded-tr-lg rounded-br-lg"
        >
          <div class="flex flex-col">
            <h2 [class]="alerts.text" class="font-bold">{{ alerts.type }}</h2>
            <p class="text-white font-bold">
              {{ message }}
            </p>
          </div>
          <!-- <div class="countdown text-white">
            <div class="number">5</div>
            <div class="number">4</div>
            <div class="number">3</div>
            <div class="number">2</div>
            <div class="number">1</div>
          </div> -->
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .caja {
      animation: descender 0.5s ease;
    }

    @keyframes descender {
      0% {
        opacity: 0.5;
        transform: translateY(-100px);
      }
      100% {
        opacity: 1;
        transform: translateY(0px);
      }
    }

    // * Animacion de countdown
    .countdown {
      display: flex;
    }

    @keyframes countdown-animation {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.5);
        opacity: 0.5;
      }
      100% {
        transform: scale(0);
        opacity: 0;
      }
    }

    .number {
      font-size: 0.6em;
      margin: 0 -4px;
      opacity: 0;
      animation: countdown-animation 1s ease forwards;
    }

    .number:nth-child(2) {
      animation-delay: 1s;
    }

    .number:nth-child(3) {
      animation-delay: 2s;
    }

    .number:nth-child(4) {
      animation-delay: 3s;
    }

    .number:nth-child(5) {
      animation-delay: 4s;
    }

    .number:nth-child(6) {
      animation-delay: 5s;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  #alertService = inject(AlertService);

  @Input() message: string = '';

  @Input() alert: Alert = 'Success';

  mapAlert: Record<Alert, Record<'color' | 'text' | 'icon' | 'type', string>> =
    {
      Error: {
        color: 'bg-red-500',
        text: 'text-red-500',
        icon: 'bx bxs-error',
        type: 'Error',
      },
      Success: {
        color: 'bg-green-500',
        text: 'text-green-500',
        icon: 'bx bx-check',
        type: 'Success',
      },
      Warning: {
        color: 'bg-amber-500',
        text: 'text-amber-500',
        icon: 'bx bx-error-alt',
        type: 'Warning',
      },
    };

  get alerts() {
    const alert = this.mapAlert[this.alert];

    return alert;
  }

  closeAlert() {
    this.#alertService.config.update((old) => {
      return { ...old, show: false };
    });
  }
}
