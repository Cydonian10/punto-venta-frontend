import { Dashboard } from '@/api/interfaces/dashboard.interface';
import { DashboarService } from '@/api/services/dashboard.service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CardInfoComponent } from './components/card-info.component';
import { TableDataComponent } from '@/components/table/table-data.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardInfoComponent, TableDataComponent],
  template: `
    @if (dashboard()) {
      <div class="flex gap-3 flex-wrap md:flex-nowrap">
        <app-card-info
          [value]="dashboard()!.totalInventoryCost"
          text="Costo total en ventas del inventario"
        />
        <app-card-info
          [value]="dashboard()!.totalInventoryPrice"
          text="Costo total en compras del inventario"
        />

        <app-card-info
          [value]="dashboard()!.totalProducts"
          text="Total de Productos"
        />

        <app-card-info
          [value]="dashboard()!.totalSalesPrice"
          text="Total de ventas"
        />
      </div>

      <div class="grid md:grid-cols-2 gap-4 mt-10">
        <div>
          <h3 class="font-semibold mb-3 text-indigo-500">
            Productos más vendido
          </h3>
          <table-data
            [columns]="columnsProduct"
            [actions]="false"
            [data]="dashboard()!.top3SelledProduct"
          />
        </div>

        <div>
          <h3 class="font-semibold mb-3 text-indigo-500">
            Productos menos vendidos
          </h3>
          <table-data
            [columns]="columnsProduct"
            [actions]="false"
            [data]="dashboard()!.top3leastSellingProducts"
          />
        </div>

        <div>
          <h3 class="font-semibold mb-3 text-indigo-500">
            Producto con menos stock
          </h3>
          <table-data
            [columns]="columnsProduct"
            [actions]="false"
            [data]="dashboard()!.productsOutOfStock"
          />
        </div>

        <div>
          <h3 class="font-semibold mb-3 text-indigo-500">Mejores clientes</h3>
          <table-data
            [columns]="columnsSales"
            [actions]="false"
            [data]="dashboard()!.topSales"
          />
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboardPage implements OnInit {
  #dashboardService = inject(DashboarService);

  public dashboard = signal<Dashboard | null>(null);
  public columnsProduct = ['name', 'stock', 'totalSales'];
  public columnsSales = ['userName', 'totalSales'];

  ngOnInit(): void {
    this.#dashboardService.getDashsboard().subscribe((resp) => {
      console.log(resp);
      this.dashboard.set(resp);
    });
  }
}
