import { Routes } from '@angular/router';
import { DashboardLayout } from '@/layouts/dashboard/dashboard.layout';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "admin",
    pathMatch: "full"
  },
  {
    path:"admin",
    component: DashboardLayout,
    children: [
      { path:"", loadComponent: () => import("./modules/dashboard/dashboard.page") },
      { path:"products", loadComponent: () => import("./modules/products/product.page") },
      { path:"categories", loadComponent: () => import("./modules/categories/category.page") },
      { path:"purchases", loadComponent: () => import("./modules/purchases/purchase.page") },
      { path:"sales", loadComponent: () => import("./modules/sales/sale.page") },
      { path:"suppliers", loadComponent: () => import("./modules/suppliers/supplier.page") },
      { path:"cash-register", loadComponent: () => import("./modules/cash-register/cash-register.page") },
      { path:"unit", loadComponent: () => import("./modules/unit/unit.page") },
    ]
  }

];
