import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeName',
  standalone: true,
})
export class ChangeNamePipe implements PipeTransform {
  transform(value: string): string {
    const values: Record<string, string> = {
      name: 'nombre',
      symbol: 'simbolo',
      description: 'descripción',
      categoryName: 'Categoria',
      type: 'tipo',
      salePrice: 'Precio',
      purchasePrice: 'Precio de compra',
      size: 'medida',
      unit: 'unidad',
      adress: 'direccion',
      phone: 'celular',
      totalCash: 'monto total',
      nombreEmpleado: 'empleado',
      date: 'fecha',
      customerName: 'cliente',
      totalPrice: 'Precio Total',
      vaucherNumber: 'vaucher',
    };

    return values[value] ?? value;
  }
}
