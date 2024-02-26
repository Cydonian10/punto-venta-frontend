import { Alert } from '@/core/interfaces/ui.interface';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  template: `
     <div class="w-full flex items-center justify-center">
        <div class="absolute z-50 top-0 mt-20 flex bg-gray-100 shadow-2xl rounded-lg entrada w-[500px]">
            <div [class]="alerts.color" class="icon flex justify-center items-center p-6 rounded-tr-3xl rounded-lg">
                <div [class]="alerts.text" class="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                  <i [class]='alerts.icon'></i>
                </div>
            </div>
            <div class="flex items-center justify-between w-full gap-3 p-4 rounded-tr-lg rounded-br-lg">
                <div class="flex flex-col">
                  <h2 [class]="alerts.text" class="font-bold">{{alerts.type}}</h2>
                  <p class="text-gray-500 font-bold">
                  {{message}}
                  </p>
                </div>
                <div class="countdown">
                  <div class="number">3</div>
                  <div class="number">2</div>
                  <div class="number">1</div>
                </div>
            </div>
        </div>
     </div>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertComponent {

  @Input() message: string = ""

  @Input() alert: Alert = 'Success'

  mapAlert: Record<Alert, Record<'color' | 'text' | 'icon' | 'type', string>> = {
    Error: {
      color: 'bg-red-500',
      text: 'text-red-500',
      icon: 'bx bxs-error',
      type: "Error"
    },
    Success: {
      color: 'bg-green-500',
      text: 'text-green-500',
      icon: 'bx bx-check',
      type: "Success"
    },
    Warning : {
      color: 'bg-amber-500',
      text: 'text-amber-500',
      icon: 'bx bx-error-alt',
      type: "Warning"
    }
  }

  get alerts() {
    const alert = this.mapAlert[this.alert]

    return alert
  }

}