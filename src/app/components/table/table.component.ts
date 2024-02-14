import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  template: `
    <div class="overflow-x-auto rounded-lg border border-gray-200">
      <table class="min-w-full divide-y-2 divide-gray-200 bg-white text-sm ">
        <thead class="ltr:text-left rtl:text-right">
          <tr>
            @for (item of header; track $index) {
              <th class="text-left whitespace-nowrap px-4 py-2 font-medium text-gray-900 sticky inset-y-0 start-0 bg-white">{{item}}</th>
            }
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <ng-content></ng-content>
        </tbody>
      </table>
    </div>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {

  @Input()
  header:string[] = []

}