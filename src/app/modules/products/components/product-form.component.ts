import { CategoryDto } from '@/api/interfaces/category.interface';
import { ProductDto } from '@/api/interfaces/products.interface';
import { UnitDto } from '@/api/interfaces/unit.interface';
import { CategoryService } from '@/api/services/category.service';
import { UnitService } from '@/api/services/unit.service';
import { InputComponent } from '@/components/input/input.component';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'product-crear-form',
  standalone: true,
  imports: [DialogLayout, InputComponent, ReactiveFormsModule],
  template: `
    <dialog-layout
      [title]="this.data ? 'Actualizar' : 'Crear'"
      (onClose)="closeDialog()"
    >
      <form [formGroup]="form" (ngSubmit)="handleSubmit()" class="space-y-3">
        <!-- dividir -->
        <div class="flex items-start gap-4">
          <app-input
            label="Nombre"
            type="text"
            [control]="form.controls.name"
          />
          <app-input
            label="Stock"
            type="number"
            [control]="form.controls.stock"
          />
        </div>
        <div class="flex items-start gap-4">
          <app-input
            label="Precio de Venta"
            type="number"
            [control]="form.controls.salePrice"
          />
          <app-input
            label="Precio de compra"
            type="number"
            [control]="form.controls.purchasePrice"
          />
        </div>
        <div class="flex items-start gap-4">
          <app-input
            label="Descuento"
            type="number"
            [control]="form.controls.purchaseDesc"
          />
          <app-input label="Tipo" type="text" [control]="form.controls.type" />
        </div>

        <div class="flex items-start gap-4">
          <app-input
            label="Descripción"
            type="text"
            [control]="form.controls.description"
          />
          <app-input
            label="Tamaño"
            type="text"
            [control]="form.controls.size"
          />
        </div>
        <div class="flex items-start gap-4">
          <div class="w-full">
            <label class="block text-sm font-bold text-gray-700">
              Categoria
            </label>
            <select formControlName="categoryId" class="input">
              @for (category of categories(); track $index) {
                <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
          </div>
          <div class="w-full">
            <label class="block text-sm font-bold text-gray-700">
              Unidad
            </label>
            <select formControlName="unitMeasurementId" class="input">
              @for (unit of units(); track $index) {
                <option [value]="unit.id">{{ unit.name }}</option>
              }
            </select>
          </div>
        </div>

        <app-input
          label="Descuento Condicional"
          type="text"
          [control]="form.controls.condicionDiscount"
        />

        <div class="flex items-center justify-end">
          @if (data) {
            <button class="btn btn-secondary w-[200px]">Actulizar</button>
          } @else {
            <button class="btn btn-secondary w-[200px]">Crear</button>
          }
        </div>
      </form>
    </dialog-layout>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCrearFormComponent implements OnInit {
  public form = this.fb.group({
    stock: new FormControl(),
    salePrice: new FormControl(),
    purchasePrice: new FormControl(),
    purchaseDesc: new FormControl(),
    type: new FormControl(),
    description: new FormControl(),
    size: new FormControl(),
    categoryId: new FormControl(),
    unitMeasurementId: new FormControl(),
    condicionDiscount: new FormControl(),
    name: new FormControl(),
  });

  public categories = signal<CategoryDto[]>([]);
  public units = signal<UnitDto[]>([]);

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: ProductDto | undefined,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private unitService: UnitService,
  ) {
    if (data) {
      this.form.patchValue({
        ...data,
        categoryId: data.category.id,
        unitMeasurementId: data.unitMeasurement.id,
      });
    }
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((resp) => {
      this.categories.set(resp);
    });

    this.unitService.getUnits().subscribe((resp) => {
      this.units.set(resp);
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  handleSubmit() {
    if (this.data) {
      this.dialogRef.close({ ...this.form.getRawValue(), id: this.data.id });
    }
    this.dialogRef.close(this.form.getRawValue());
  }
}
