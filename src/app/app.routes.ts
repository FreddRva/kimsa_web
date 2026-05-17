import { Routes } from '@angular/router';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'mozo',
    canActivate: [roleGuard(['waiter', 'mozo'])],
    loadComponent: () => import('./features/waiter/waiter.component').then((m) => m.WaiterComponent),
  },
  {
    path: 'caja',
    canActivate: [roleGuard(['cashier', 'cajero'])],
    loadComponent: () => import('./features/cashier/cashier.component').then((m) => m.CashierComponent),
  },
  {
    path: 'admin',
    canActivate: [roleGuard(['admin'])],
    loadComponent: () => import('./features/admin/admin.component').then((m) => m.AdminComponent),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
