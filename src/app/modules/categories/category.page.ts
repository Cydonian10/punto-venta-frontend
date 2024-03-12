import {
  CreateCategoryDto,
  CategoryDto,
  UpdateCategoryDto,
} from '@/api/interfaces/category.interface';
import { CategoryService } from '@/api/services/category.service';
import { TableComponent } from '@/components/table/table.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CategoryFormComponent } from './components/category-form.component';
import { AlertComponent } from '@/components/alert/alert.component';
import { AlertService } from '@/core/services/alert.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of, switchMap } from 'rxjs';
import { InputComponent } from '@/components/input/input.component';
import { TableDataComponent } from '@/components/table/table-data.component';

@Component({
  selector: 'app-category',
  standalone: true,
  template: `
    <div class="entrada">
      <app-title-create title="Categorias" (onOpenDialog)="openDiloagCrear()">
        <app-input [control]="filterName" />
      </app-title-create>

      <table-data
        [columns]="columns"
        [data]="categories()"
        (onDelete)="deleteCategory($event.id)"
        (onUpdate)="openDiloagCrear($event)"
      />
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleCreateComponent,
    DialogModule,
    AlertComponent,
    ReactiveFormsModule,
    InputComponent,
    TableDataComponent,
  ],
})
export default class CategoryPage implements OnInit {
  // Services
  #categoryService = inject(CategoryService);
  #dialog = inject(Dialog);
  #alertService = inject(AlertService);

  // Propertities
  public categories = signal<CategoryDto[]>([]);
  public columns = ['name', 'description'];

  // ReactiForm
  public filterName = new FormControl('', {
    nonNullable: true,
  });

  ngOnInit(): void {
    this.getCategories();

    this.filterName.valueChanges
      .pipe(
        debounceTime(1000),
        switchMap((resp) => {
          if (resp === '') {
            return of(null);
          } else {
            return this.#categoryService.filterByName(resp);
          }
        }),
      )
      .subscribe((filteredResults) => {
        if (filteredResults === null) {
          this.getCategories();
        } else {
          this.categories.set(filteredResults);
        }
      });
  }

  getCategories() {
    this.#categoryService.getCategories().subscribe({
      next: (resp) => this.categories.set(resp),
    });
  }

  openDiloagCrear(dto?: CategoryDto) {
    const dilogRef = this.#dialog.open(CategoryFormComponent, {
      width: '400px',
      backdropClass: 'bg-black/60',
      data: dto,
      disableClose: true,
    });

    dilogRef.closed.subscribe((resp: any) => {
      if (resp === undefined) {
        this.#alertService.showAlertWarning('Cancelado');
        return;
      }
      if (resp.id) {
        const { id, ...res } = resp;
        this.updateCategory(res, id);
      } else {
        this.crearCategory(resp);
      }
    });
  }

  crearCategory(data: CreateCategoryDto) {
    this.#categoryService.crearCategory(data).subscribe((resp: any) => {
      this.categories.update((old) => [resp, ...old]);
      this.#alertService.showAlertSuccess('Creado Correctamente');
    });
  }

  updateCategory(data: UpdateCategoryDto, id: number) {
    this.#categoryService.updateCategory(data, id).subscribe(() => {
      this.categories.update((old) => {
        return old.map((item) => {
          if (item.id === id) {
            (item.description = data.description), (item.name = data.name);
            item.id = id;
          }
          return item;
        });
      });
      this.#alertService.showAlertSuccess('Update Correctamente');
    });
  }

  deleteCategory(id: number) {
    const alert = window.confirm('Estas seguro de eliminar ? ');
    if (alert) {
      this.#categoryService.deleteCategory(id).subscribe(() => {
        this.categories.update((old) => {
          return old.filter((item) => item.id !== id);
        });
        this.#alertService.showAlertSuccess('Eliminado Correctamente');
      });
    }
  }
}
