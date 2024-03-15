import { Routes } from '@angular/router';
import { DashboardLayout } from '@/layouts/dashboard/dashboard.layout';
import { authGuard } from './core/guards/auth.guard';
import { redirectGuard } from './core/guards/redirect.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [redirectGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./modules/auth/login.page'),
      },
    ],
  },
  {
    path: 'admin',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/dashboard/dashboard.page'),
      },
      {
        path: 'users',
        loadComponent: () => import('./modules/users/users.page'),
      },
      {
        path: 'products',
        loadComponent: () => import('./modules/products/product.page'),
      },
      {
        path: 'categories',
        loadComponent: () => import('./modules/categories/category.page'),
      },
      {
        path: 'purchases',
        loadComponent: () => import('./modules/purchases/purchase.page'),
      },
      {
        path: 'sales',
        loadComponent: () => import('./modules/sales/sale.page'),
      },
      {
        path: 'suppliers',
        loadComponent: () => import('./modules/suppliers/supplier.page'),
      },
      {
        path: 'cash-register',
        loadComponent: () =>
          import('./modules/cash-register/cash-register.page'),
      },
      {
        path: 'cash-register/history/:id',
        loadComponent: () =>
          import('./modules/cash-register/cash-history.page'),
      },
      { path: 'unit', loadComponent: () => import('./modules/unit/unit.page') },
      {
        path: 'qr-code',
        loadComponent: () => import('./modules/qrcode/qrcode.page'),
      },
    ],
  },
];
