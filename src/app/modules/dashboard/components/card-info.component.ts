import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
} from '@angular/core';

@Component({
  selector: 'app-card-info',
  standalone: true,
  imports: [],
  template: `
    <div class="bg-gray-200/50 p-8 rounded-xl w-full">
      <div class="flex items-center justify-between mb-4">
        <i class="bx bx-hourglass text-4xl text-yellow-500"></i>
      </div>
      <div>
        <h1 class="text-4xl text-gray-700 font-bold mb-4">{{ value }}</h1>
        <p class="text-yellow-600 font-semibold">{{ text }}</p>
      </div>
      <hr class="border border-dashed border-gray-500/50 my-4" />
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardInfoComponent {
  @Input({ required: true }) value: number = 0;
  @Input({ required: true }) text: string = '';
}
