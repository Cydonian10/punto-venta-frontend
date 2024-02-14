import { CategoryDto } from '@/api/interfaces/category.interface';
import { CategoryService } from '@/api/services/category.service';
import { TableComponent } from '@/components/table/table.component';
import { TitleCreateComponent } from '@/components/title/title-create.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CategoryFormComponent } from './components/category-form.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [TableComponent,TitleCreateComponent,DialogModule],
  template: `

    <app-title-create title="Categorias" (onOpenDialog)="openDiloagCrear()" />

    <app-table [header]="header">
      @for (category of categories(); track $index) {
        <tr class="hover:bg-gray-100 transition-all">
          <td class="sticky inset-y-0 start-0 bg-white whitespace-nowrap px-4 py-2 font-medium text-gray-900">{{ category.id }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ category.name }}</td>
          <td class="whitespace-nowrap px-4 py-2 text-gray-700">{{ category.description }}</td>
        </tr>
      }
    </app-table>
  `,
  styles: `
   :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class CategoryPage implements OnInit {

  #categoryService = inject(CategoryService)
  #dialog = inject(Dialog)

  public categories = signal<CategoryDto[]>([])
  public header = ["N°","Nombre","description"]

  ngOnInit(): void {
    this.#categoryService.getCategories().subscribe({
        next: (resp) => this.categories.set(resp)
      }
    )
  }

  openDiloagCrear() {
    this.#dialog.open(CategoryFormComponent, {
      width:"100%",
      data: {
        animal: 'panda',
      },
      disableClose:true,
    });
  }

}