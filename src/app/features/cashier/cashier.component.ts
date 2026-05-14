import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Order } from '../../shared/models';
import { OrderRepository } from '../../data/repositories/order.repository';
import { NexusViewComponent } from './components/nexus-view/nexus-view.component';
import { HistoryViewComponent } from './components/history-view/history-view.component';
import { BalanceViewComponent } from './components/balance-view/balance-view.component';

@Component({
  selector: 'app-cashier',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    NexusViewComponent,
    HistoryViewComponent,
    BalanceViewComponent,
  ],
  templateUrl: './cashier.component.html',
  styleUrl: './cashier.component.css',
})
export class CashierComponent {
  private orderRepo = inject(OrderRepository);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  activeOrders = signal<Order[]>([]);
  paidOrders = signal<Order[]>([]);
  cancelledOrders = signal<Order[]>([]);
  selectedOrderId = signal<string | null>(null);
  selectedOrder = signal<Order | null>(null);
  selectedMethod = signal(0);
  selectedTab = signal(0);
  filter = signal('TODAS');
  menuOpen = signal(false);

  filteredOrders = computed(() => {
    const orders = this.activeOrders();
    const f = this.filter();
    if (f === 'SALÓN') return orders.filter((o) => !o.isDelivery);
    if (f === 'PARA LLEVAR') return orders.filter((o) => !!o.isDelivery);
    return orders;
  });

  stats = computed(() => {
    const orders = this.paidOrders();
    const cancelled = this.cancelledOrders();
    return {
      total: orders.reduce((sum, o) => sum + (o.total || 0), 0),
      cash: orders
        .filter((o) => o.paymentMethod === 'EFECTIVO')
        .reduce((sum, o) => sum + (o.total || 0), 0),
      card: orders
        .filter((o) => o.paymentMethod === 'TARJETA')
        .reduce((sum, o) => sum + (o.total || 0), 0),
      digital: orders
        .filter((o) => ['YAPE', 'PLIN'].includes(o.paymentMethod || ''))
        .reduce((sum, o) => sum + (o.total || 0), 0),
      cancelled: cancelled.reduce((sum, o) => sum + (o.total || 0), 0),
    };
  });

  constructor() {
    this.loadOrders();
    this.notificationService.listenForNewOrdersForCashier();

    effect(() => {
      const orders = this.activeOrders();
      if (orders.length > 0 && !this.selectedOrderId()) {
        const urgent = orders.find((o) => o.status === 'waiting_payment');
        this.selectOrder(urgent || orders[0]);
      }
    });
  }

  loadOrders() {
    this.orderRepo.getActiveOrders().subscribe((orders) => {
      this.activeOrders.set(this.sortOrders(orders));
    });

    this.orderRepo.getPaidOrders().subscribe((orders) => {
      this.paidOrders.set(this.sortOrders(orders));
    });

    this.orderRepo.getCancelledOrders().subscribe((orders) => {
      this.cancelledOrders.set(this.sortOrders(orders));
    });
  }

  private sortOrders(orders: Order[]): Order[] {
    return orders.sort((a, b) => {
      const ta = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
      const tb = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
      return tb - ta;
    });
  }

  selectOrder(order: Order) {
    this.selectedOrderId.set(order.id);
    this.selectedOrder.set(order);
  }

  onConfirmPayment(event?: { method: number, docType: string, docNumber: string }) {
    const order = this.selectedOrder();
    if (!order || !event) return;

    const methods = ['EFECTIVO', 'TARJETA', 'YAPE'];
    const method = methods[event.method];

    this.orderRepo.confirmPayment(order.id, method, order.tableId, event.docType, event.docNumber).then(() => {
      this.selectedOrderId.set(null);
      this.selectedOrder.set(null);
    });
  }

  async onCancelOrder(order: Order) {
    const { ConfirmDialogComponent } = await import('../../ui/confirm-dialog/confirm-dialog.component');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'bg-transparent',
      data: {
        title: 'Anular Pedido',
        message: `¿Estás seguro de que deseas anular el pedido de la MESA ${order.tableNumber || order.tableId}? Esta acción no se puede deshacer.`,
        confirmText: 'SÍ, ANULAR'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.orderRepo.cancelOrder(order.id, order.tableId).then(() => {
          if (this.selectedOrderId() === order.id) {
            this.selectedOrderId.set(null);
            this.selectedOrder.set(null);
          }
        });
      }
    });
  }

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  onPrintSummary() {
    window.print();
  }

  onCloseShift() {
    alert('Función de Cerrar Turno y Caja en desarrollo.');
  }

  userName(): string {
    return this.authService.currentUserData()?.name || 'Cajero';
  }

  closeMenuAndLogout() {
    this.menuOpen.set(false);
    this.onLogout();
  }

  onLogout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
