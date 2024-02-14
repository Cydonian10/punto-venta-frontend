import {
  CategoryCrearDto,
  CategoryDto,
  CategoryUpdateDto,
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

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [TableComponent, TitleCreateComponent, DialogModule, AlertComponent],
  template: `
    <div class="entrada">
      <app-title-create title="Categorias" (onOpenDialog)="openDiloagCrear()" />

      <app-table [header]="header">
        @for (category of categories(); track $index) {
        <tr class="hover:bg-gray-100 transition-all">
          <td
            class="sticky inset-y-0 start-0 bg-white whitespace-nowrap px-4 py-2 font-medium text-gray-900"
          >
            {{ $index + 1 }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ category.name }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            {{ category.description }}
          </td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">
            <div class="flex items-start gap-2">
              <button class="btn-icon btn-icon-primary px-2 py-1" (click)="openDiloagCrear(category)">
                <i class="bx bxs-pencil"></i>
              </button>
              <button class="btn-icon btn-icon-danger px-2 py-1" (click)="deleteCategory(category.id)">
                <i class="bx bxs-trash-alt"></i>
              </button>
            </div>
          </td>
        </tr>
        }
      </app-table>
    </div>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CategoryPage implements OnInit {
  #categoryService = inject(CategoryService);
  #dialog = inject(Dialog);
  #alertService = inject(AlertService);

  public categories = signal<CategoryDto[]>([]);
  public header = ['N°', 'Nombre', 'Description', 'Actions'];

  ngOnInit(): void {
    this.#categoryService.getCategories().subscribe({
      next: (resp) => this.categories.set(resp),
    });
  }

  openDiloagCrear(dto?: CategoryDto) {
    const dilogRef = this.#dialog.open(CategoryFormComponent, {
      width: '100%',
      data: dto,
      disableClose: true,
    });

    dilogRef.closed.subscribe((resp: any) => {
      if (resp === undefined) {
        this.#alertService.showAlertError('Cancelado');
        return;
      }
      if(resp.id) {
        const {id,...res} = resp
        this.updateCategory(res,id)
      }else {
        this.crearCategory(resp)
      }
    });
  }

  crearCategory(data: CategoryCrearDto) {
    this.#categoryService.crearCategory(data).subscribe((resp: any) => {
      this.categories.update((old) => [resp, ...old]);
      this.#alertService.showAlertSuccess('Creado Correctamente');
    });
  }

  updateCategory(data: CategoryUpdateDto,id:number) {
    this.#categoryService.updateCategory(data,id).subscribe(() => {
      this.categories.update(old => {
        return old.map(item =>  {
          if(item.id === id) {
            item.description = data.description,
            item.name = data.name
            item.id = id
          }
          return item
         })
      })
      this.#alertService.showAlertSuccess('Update Correctamente');
    });
  }

  deleteCategory(id:number) {
    const alert =  window.confirm("Estas seguro de eliminar ? ")
    if(alert) {
      this.#categoryService.deleteCategory(id).subscribe( () => {
        this.categories.update(old => {
          return old.filter(item => item.id !== id)
        })
        this.#alertService.showAlertSuccess('Eliminado Correctamente');
      })
    }
  }
}
