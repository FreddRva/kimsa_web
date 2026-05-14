import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'mozo',
    loadComponent: () => import('./features/waiter/waiter.component').then((m) => m.WaiterComponent),
  },
  {
    path: 'caja',
    loadComponent: () =>
      import('./features/cashier/cashier.component').then((m) => m.CashierComponent),
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then((m) => m.AdminComponent),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
