import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KSidebarComponent } from '../../core/layout/sidebar/sidebar.component';
import { KHeaderComponent } from '../../core/layout/header/header.component';
import { NotificationCenterComponent } from '../../core/layout/notification-center/notification-center.component';
import { NavItem } from '../../core/layout/sidebar/sidebar.component';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';

import { VistaDashboardComponent } from './pages/vista-dashboard/vista-dashboard.component';
import { VistaMenuAdminComponent } from './pages/vista-menu/vista-menu.component';
import { VistaCategoriaComponent } from './pages/vista-categoria/vista-categoria.component';
import { VistaMesaAdminComponent } from './pages/vista-mesa/vista-mesa.component';
import { VistaConfiguracionComponent } from './pages/vista-configuracion/vista-configuracion.component';
import { VistaDistribucionEstacionesComponent } from './pages/vista-distribucion-estaciones/vista-distribucion-estaciones.component';
import { VistaEmpleadoComponent } from './pages/vista-empleado/vista-empleado.component';
import { VistaClienteAdminComponent } from './pages/vista-cliente/vista-cliente.component';
import { DashboardFacade } from '../../core/application/facades/dashboard.facade';
import { StaffFacade } from './facades/staff.facade';
import { SettingsFacade } from './facades/settings.facade';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    KSidebarComponent,
    KHeaderComponent,
    NotificationCenterComponent,
    VistaDashboardComponent,
    VistaMenuAdminComponent,
    VistaCategoriaComponent,
    VistaMesaAdminComponent,
    VistaConfiguracionComponent,
    VistaDistribucionEstacionesComponent,
    VistaEmpleadoComponent,
    VistaClienteAdminComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  private authService = inject(AuthService);
  public notificationService = inject(NotificationService);
  private router = inject(Router);

  selectedTab = signal(0);
  isNotificationCenterOpen = signal(false);
  menuOpen = signal(false);

  navItems: NavItem[] = [
    { id: 0, label: 'Overview',                  section: 'PRINCIPAL',   icon: 'dashboard_customize' },
    { id: 1, label: 'Menú & Productos',           section: 'PRINCIPAL',   icon: 'restaurant_menu' },
    { id: 2, label: 'Categorías',                 section: 'PRINCIPAL',   icon: 'collections_bookmark' },
    { id: 3, label: 'Distribución Estaciones',    section: 'PRINCIPAL',   icon: 'call_split' },
    { id: 7, label: 'Clientes',                   section: 'PRINCIPAL',   icon: 'groups' },
    { id: 4, label: 'Gestión de Mesas',           section: 'OPERACIONES', icon: 'table_bar' },
    { id: 5, label: 'Equipo / Personal',          section: 'SISTEMA',     icon: 'badge' },
    { id: 6, label: 'Configuración',              section: 'SISTEMA',     icon: 'tune' },
  ];

  constructor() {
    this.notificationService.listenForNewOrders();
    this.notificationService.listenForNewOrdersForCashier();
  }

  getTabTitle(): string {
    const titles: { [key: number]: string } = {
      0: 'DASHBOARD GENERAL', 1: 'GESTOR DE MENÚ', 2: 'GESTOR DE CATEGORÍAS',
      3: 'DISTRIBUCIÓN DE ESTACIONES', 4: 'GESTIÓN DE MESAS',
      5: 'GESTIÓN DE EMPLEADOS', 6: 'CONFIGURACIÓN DE SISTEMA', 7: 'BASE DE CLIENTES'
    };
    return titles[this.selectedTab()] ?? 'ADMIN';
  }

  onTabChange(id: number) { this.selectedTab.set(id); }
  userName(): string { return this.authService.currentUserData()?.name || 'Admin'; }
  onLogout() { this.authService.logout().subscribe(() => this.router.navigate(['/login'])); }
}
