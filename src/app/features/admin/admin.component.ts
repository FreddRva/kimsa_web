import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KSidebarComponent } from '../../core/layout/sidebar/sidebar.component';
import { KHeaderComponent } from '../../core/layout/header/header.component';
import { NotificationCenterComponent } from '../../core/layout/notification-center/notification-center.component';
import { NavItem } from '../../core/layout/sidebar/sidebar.component';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Product, Category, Order } from '../../shared/models';
import { AdminStore } from '../../store/admin.store';

import { DashboardViewComponent } from './views/dashboard-view/dashboard-view.component';
import { MenuViewComponent } from './views/menu-view/menu-view.component';
import { CategoryViewComponent } from './views/category-view/category-view.component';
import { TableViewComponent } from './views/table-view/table-view.component';
import { SettingsViewComponent } from './views/settings-view/settings-view.component';
import { StationDistributionViewComponent } from './views/station-distribution-view/station-distribution-view.component';
import { EmployeeViewComponent } from './views/employee-view/employee-view.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    KSidebarComponent,
    KHeaderComponent,
    NotificationCenterComponent,
    DashboardViewComponent,
    MenuViewComponent,
    CategoryViewComponent,
    TableViewComponent,
    SettingsViewComponent,
    StationDistributionViewComponent,
    EmployeeViewComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  public adminStore = inject(AdminStore);
  private authService = inject(AuthService);
  private router = inject(Router);
  public notificationService = inject(NotificationService);

  isNotificationCenterOpen = signal(false);

  selectedTab = signal(0);
  products = this.adminStore.products;
  categories = this.adminStore.categories;
  tables = this.adminStore.tables;
  paidOrders = this.adminStore.paidOrders;
  users = this.adminStore.users;
  filterText = signal('');
  menuOpen = signal(false);

  navItems: NavItem[] = [
    { id: 0, label: 'Overview', section: 'PRINCIPAL', icon: 'dashboard_customize' },
    { id: 1, label: 'Menú & Productos', section: 'PRINCIPAL', icon: 'restaurant_menu' },
    { id: 2, label: 'Categorías', section: 'PRINCIPAL', icon: 'collections_bookmark' },
    { id: 3, label: 'Distribución Estaciones', section: 'PRINCIPAL', icon: 'call_split' },
    { id: 4, label: 'Gestión de Mesas', section: 'OPERACIONES', icon: 'table_bar' },
    { id: 5, label: 'Equipo / Personal', section: 'SISTEMA', icon: 'badge' },
    { id: 6, label: 'Configuración', section: 'SISTEMA', icon: 'tune' },
  ];

  filteredProducts = computed(() => {
    const text = this.filterText().toLowerCase();
    return this.products().filter((p) => !p.isDeleted && p.name.toLowerCase().includes(text));
  });

  stats = computed(() => {
    const orders = this.paidOrders();
    const today = new Date().toDateString();
    const todayOrders = orders.filter((o) => {
      const d = o.timestamp?.toDate ? o.timestamp.toDate() : new Date(o.timestamp);
      return d.toDateString() === today;
    });
    const sales = todayOrders.reduce((acc, o) => acc + (o.total || 0), 0);
    return {
      todaySales: sales,
      orderCount: todayOrders.length,
      avgTicket: todayOrders.length > 0 ? sales / todayOrders.length : 0,
      activeTables: this.tables().filter((t) => t.status === 'occupied').length,
    };
  });

  constructor() {
    this.notificationService.listenForNewOrders();
    this.notificationService.listenForNewOrdersForCashier();
  }

  getTabTitle(): string {
    const titles = [
      'DASHBOARD GENERAL',
      'GESTOR DE MENÚ',
      'GESTOR DE CATEGORÍAS',
      'DISTRIBUCIÓN DE ESTACIONES',
      'GESTIÓN DE MESAS',
      'GESTIÓN DE EMPLEADOS',
      'CONFIGURACIÓN DE SISTEMA',
    ];
    return titles[this.selectedTab()] ?? 'ADMIN';
  }

  onTabChange(id: number) {
    this.selectedTab.set(id);
  }
  userName(): string {
    return this.authService.currentUserData()?.name || 'Admin';
  }

  onLogout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
