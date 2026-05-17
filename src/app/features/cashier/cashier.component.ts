import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { KHeaderComponent } from '../../core/layout/header/header.component';
import { VistaNexusComponent } from './pages/vista-nexus/vista-nexus.component';
import { VistaHistorialComponent } from './pages/vista-historial/vista-historial.component';
import { VistaBalanceComponent } from './pages/vista-balance/vista-balance.component';
import { VistaClienteComponent } from './pages/vista-cliente/vista-cliente.component';
import { NexusStore } from './store/nexus.store';

@Component({
  selector: 'app-cashier',
  standalone: true,
  providers: [NexusStore],
  imports: [
    KHeaderComponent,
    VistaNexusComponent,
    VistaHistorialComponent,
    VistaBalanceComponent,
    VistaClienteComponent,
  ],
  templateUrl: './cashier.component.html',
  styleUrl: './cashier.component.css',
})
export class CashierComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  selectedTab = signal(0);

  constructor() {
    this.notificationService.listenForNewOrdersForCashier();
  }

  userName(): string { return this.authService.currentUserData()?.name || 'Cajero'; }
  getTabTitle(): string {
    const titles: { [key: number]: string } = { 0: 'CENTRO DE VENTAS', 1: 'HISTORIAL PAGOS', 2: 'CIERRE DE CAJA', 3: 'BASE DE CLIENTES' };
    return titles[this.selectedTab()] || 'CAJA';
  }
  onLogout() { this.authService.logout().subscribe(() => this.router.navigate(['/login'])); }
}
