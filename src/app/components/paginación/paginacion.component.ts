import { PageDto } from '@/api/interfaces/page.interface';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-paginacion',
  standalone: true,
  imports: [],
  template: `
    <span>Total: {{ totalPage }} / Page: {{ paginacion.page }} - Items por pagina: {{ paginacion.quantityRecordsPerPage }} </span>
    <div class="flex gap-3 items-start">
      <button
        (click)="previus()"
        class="bg-red-500 text-white py-1.5 px-4 rounded-md"
      >
        <i class="bx bx-skip-previous"></i>
      </button>

      <button
        (click)="next()"
        class="bg-slate-800 text-white py-1.5 px-4 rounded-md"
      >
        <i class="bx bx-skip-next"></i>
      </button>
    </div>
  `,
  styles: `
   :host {
      display: flex;
      margin: 20px 0px;
      justify-content:center;
      align-items:center;
      flex-direction: column;
      gap: 4px
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginacionComponent {
  @Input({ required: true }) paginacion: PageDto = {
    page: 1,
    quantityRecordsPerPage: 4,
  };
  @Input({ required: true }) totalPage: number = 4;
  @Input() itemsPerPage = 0;

  @Output() onNext = new EventEmitter<PageDto>();
  @Output() onPrevius = new EventEmitter<PageDto>();

  next() {
    let page = this.paginacion.page;
    if (page === this.totalPage) {
      return;
    }
    this.paginacion.page = this.paginacion.page + 1;
    this.onNext.emit(this.paginacion);
  }
  previus() {
    let page = this.paginacion.page;
    if (page === 1) {
      return;
    }
    this.paginacion.page = this.paginacion.page - 1;
    this.onPrevius.emit(this.paginacion);
  }
}
