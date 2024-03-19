import { CategoryDto } from '@/api/interfaces/category.interface';
import { ProductDto } from '@/api/interfaces/products.interface';
import { UnitDto } from '@/api/interfaces/unit.interface';
import { CategoryService } from '@/api/services/category.service';
import { ProductService } from '@/api/services/product.service';
import { UnitService } from '@/api/services/unit.service';
import { InputComponent } from '@/components/input/input.component';
import { DialogLayout } from '@/layouts/dialog/dialog.layout';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
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

        <app-input
          label="Codigo"
          type="number"
          [control]="form.controls.barCode"
        />

        <input type="file" (change)="onFileSelectd($event)" />

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
  #productService = inject(ProductService);
  // archivoSeleccionado: File | null = null;

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
    barCode: new FormControl(),
    image: new FormControl(),
  });

  public categories = signal<CategoryDto[]>([]);
  public units = signal<UnitDto[]>([]);

  get stock() {
    return this.form.controls.stock;
  }
  get salePrice() {
    return this.form.controls.salePrice;
  }
  get purchasePrice() {
    return this.form.controls.purchasePrice;
  }
  get purchaseDesc() {
    return this.form.controls.purchaseDesc;
  }
  get type() {
    return this.form.controls.type;
  }
  get description() {
    return this.form.controls.description;
  }
  get size() {
    return this.form.controls.size;
  }
  get categoryId() {
    return this.form.controls.categoryId;
  }
  get unitMeasurementId() {
    return this.form.controls.unitMeasurementId;
  }
  get condicionDiscount() {
    return this.form.controls.condicionDiscount;
  }
  get name() {
    return this.form.controls.name;
  }
  get barCode() {
    return this.form.controls.barCode;
  }
  get image() {
    return this.form.controls.image;
  }

  constructor(
    private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) public data: ProductDto | undefined,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private unitService: UnitService,
  ) {
    if (data) {
      console.log('data =>', data);
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

  onFileSelectd(event: any) {
    this.image.setValue(event.target.files[0]);
  }

  handleSubmit() {
    const formData = new FormData();

    formData.append('stock', this.stock.getRawValue());
    formData.append('salePrice', this.salePrice.getRawValue());
    formData.append('purchasePrice', this.purchasePrice.getRawValue());
    formData.append('purchaseDesc', this.purchaseDesc.getRawValue());
    formData.append('type', this.type.getRawValue());
    formData.append('description', this.description.getRawValue());
    formData.append('size', this.size.getRawValue());
    formData.append('categoryId', this.categoryId.getRawValue());
    formData.append('unitMeasurementId', this.unitMeasurementId.getRawValue());
    formData.append('condicionDiscount', this.condicionDiscount.getRawValue());
    formData.append('name', this.name.getRawValue());
    formData.append('barCode', this.barCode.getRawValue());
    formData.append('image', this.image.getRawValue());

    if (this.data) {
      if (this.data.salePrice !== this.form.controls.salePrice.getRawValue()) {
        this.#productService
          .updateSalePrice(
            this.form.controls.salePrice.getRawValue(),
            this.data.id,
          )
          .subscribe();
      }
      // this.dialogRef.close({ ...this.form.getRawValue(), id: this.data.id });
      this.dialogRef.close({ data: formData, id: this.data.id });
    }
    this.dialogRef.close({ data: formData });
  }
}
