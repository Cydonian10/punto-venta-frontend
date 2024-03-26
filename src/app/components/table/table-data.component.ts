import { ChangeNamePipe } from '@/core/pipes/change-name.pipe';
import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'table-data',
  standalone: true,
  imports: [ChangeNamePipe, TitleCasePipe, NgClass, DatePipe],
  template: `
    <!-- max-h-[500px] lg:max-h-[700px] -->
    <div class="overflow-x-auto rounded-lg border border-gray-200  ">
      <table class="min-w-full divide-y-2 divide-gray-200 bg-white  text-sm">
        <thead
          class="ltr:text-left rtl:text-right sticky top-0 inset-x-0 whitespace-nowrap bg-white z-10"
        >
          <tr>
            <th class="whitespace-nowrap px-4 py-2 text-gray-700 text-left">
              N°
            </th>
            @for (item of _columns; track $index) {
              <th
                [ngClass]="{
                  'sticky inset-y-0 start-0 bg-white whitespace-nowrap px-2 py-2 font-medium text-gray-900':
                    item === 'name'
                }"
                class="whitespace-nowrap px-4 py-2 text-gray-700 text-left"
              >
                {{ item | changeName | titlecase }}
              </th>
            }
            @if (_actions) {
              <th class="whitespace-nowrap px-4 py-2 text-gray-700 text-left">
                Acciones
              </th>
            }
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          @for (data of _dataSource; track $index) {
            <tr class="hover:bg-gray-100 transition-all">
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                {{ $index + 1 }}
              </td>
              @for (colum of _columns; track $index) {
                @if (colum.includes('rice') || colum.includes('total')) {
                  <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                    s/ {{ data[colum] }}
                  </td>
                } @else if (colum === 'image') {
                  <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                    <img width="100px" [src]="data[colum]" alt="" />
                  </td>
                } @else {
                  <td
                    [ngClass]="{
                      'sticky inset-y-0 start-0 bg-white whitespace-nowrap px-2 py-2 font-medium text-gray-900':
                        colum === 'name'
                    }"
                    class="whitespace-nowrap px-4 py-2 text-gray-700"
                  >
                    {{ colum !== 'date' ? data[colum] : (data[colum] | date) }}
                  </td>
                }
              }
              <td class="whitespace-nowrap px-4 py-2 text-gray-700">
                <div class="flex items-start gap-2">
                  @if (_actions) {
                    <button
                      (click)="handleUpdate(data)"
                      class="btn-icon btn-icon-primary px-2 py-1"
                    >
                      <i class="bx bxs-pencil"></i>
                    </button>
                    <button
                      (click)="handleDelete(data)"
                      class="btn-icon btn-icon-danger px-2 py-1"
                    >
                      <i class="bx bxs-trash-alt"></i>
                    </button>

                    <button
                      (click)="handleHistory(data.id)"
                      class="btn-icon btn-icon-primary px-2 py-1"
                    >
                      <i class="bx bx-detail"></i>
                    </button>
                  }

                  @if (_select) {
                    <button
                      (click)="handleSelect(data)"
                      class="btn-icon btn-icon-primary px-2 py-1"
                    >
                      <i class="bx bxs-add-to-queue"></i>
                    </button>
                  }
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableDataComponent {
  _title = '';
  _columns: string[] = [];
  _dataSource: any = [];
  _select: boolean = false;
  _actions: boolean = true;

  @Input() set title(title: any) {
    this._title = title;
  }

  @Input() set columns(columns: string[]) {
    this._columns = columns;
  }

  @Input() set data(data: any) {
    this._dataSource = data;
  }

  @Input() set select(value: boolean) {
    this._select = value;
  }

  @Input() set actions(value: boolean) {
    this._actions = value;
  }

  @Output() onUpdate = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Output() onSelect = new EventEmitter();
  @Output() onHistory = new EventEmitter();

  handleUpdate(value: any) {
    this.onUpdate.emit(value);
  }

  handleDelete(value: any) {
    this.onDelete.emit(value);
  }

  handleSelect(value: any) {
    this.onSelect.emit(value);
  }

  handleHistory(id: number) {
    this.onHistory.emit(id);
  }
}
