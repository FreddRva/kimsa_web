import { Injectable, inject, computed } from '@angular/core';
import { OrderFacade } from './order.facade';
import { TableFacade } from './table.facade';
import { Order } from '../../domain/order/order.model';

export interface DashboardTransaction extends Order {
  date: Date;
  totalAmount: number;
}

export interface TopProductPerformance {
  name: string;
  total: number;
}

export interface DashboardStats {
  todaySales: number;
  cash: number;
  card: number;
  digital: number;
  cancelled: number;
  orderCount: number;
  avgTicket: number;
  activeTables: number;
  monthlySales: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private orderFacade = inject(OrderFacade);
  private tableFacade = inject(TableFacade);

  paidOrders = this.orderFacade.paidOrders;
  activeTablesCount = computed(() => this.tableFacade.tables().filter(t => t.status === 'occupied').length);

  // Lógica de "Día Contable": Si es antes de las 5 AM, todavía se considera el día anterior
  getAccountingDate(date: Date): string {
    const d = new Date(date);
    if (d.getHours() < 5) {
      d.setDate(d.getDate() - 1);
    }
    return d.toDateString();
  }

  toDate(order: Order): Date {
    return order.paidAt || order.timestamp;
  }

  getOrderTotal(order: Order): number {
    return order.total ?? 0;
  }

  stats = computed<DashboardStats>(() => {
    const orders = this.paidOrders();
    const todayAccountingStr = this.getAccountingDate(new Date());

    const todayOrders = orders.filter(o => this.getAccountingDate(this.toDate(o)) === todayAccountingStr);
    
    const cash = todayOrders.filter(o => o.paymentMethod === 'EFECTIVO').reduce((acc, o) => acc + this.getOrderTotal(o), 0);
    const card = todayOrders.filter(o => o.paymentMethod === 'TARJETA').reduce((acc, o) => acc + this.getOrderTotal(o), 0);
    const digital = todayOrders.filter(o => o.paymentMethod === 'YAPE' || o.paymentMethod === 'PLIN' || o.paymentMethod === 'DIGITAL').reduce((acc, o) => acc + this.getOrderTotal(o), 0);
    
    const cancelledOrders = this.orderFacade.cancelledOrders();
    const cancelled = cancelledOrders.filter(o => this.getAccountingDate(this.toDate(o)) === todayAccountingStr).reduce((acc, o) => acc + this.getOrderTotal(o), 0);

    return {
      todaySales: todayOrders.reduce((acc: number, o) => acc + this.getOrderTotal(o), 0),
      cash,
      card,
      digital,
      cancelled,
      orderCount: todayOrders.length,
      avgTicket: todayOrders.length > 0 ? (todayOrders.reduce((acc: number, o) => acc + this.getOrderTotal(o), 0) / todayOrders.length) : 0,
      activeTables: this.activeTablesCount(),
      monthlySales: orders.reduce((acc: number, o) => acc + this.getOrderTotal(o), 0)
    };
  });

  weeklySales = computed(() => {
    const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    const results = days.map(d => ({ day: d, total: 0, height: 0 }));
    
    this.paidOrders().forEach(o => {
      const d = this.toDate(o);
      const dayName = days[d.getDay()];
      const res = results.find(r => r.day === dayName);
      if (res) res.total += this.getOrderTotal(o);
    });

    const max = Math.max(...results.map(r => r.total), 1);
    results.forEach(r => r.height = Math.max((r.total / max) * 100, 2));
    return results;
  });

  topProducts = computed<TopProductPerformance[]>(() => {
    const products: { [key: string]: { name: string, total: number } } = {};
    this.paidOrders().forEach(o => {
      o.items?.forEach(item => {
        const name = item.name || 'Producto';
        if (!products[name]) products[name] = { name, total: 0 };
        products[name].total += ((item.price || 0) * (item.quantity || 1));
      });
    });
    return Object.values(products).sort((a, b) => b.total - a.total).slice(0, 5);
  });

  recentTransactions = computed<DashboardTransaction[]>(() => {
    return this.paidOrders()
      .map(o => ({
        ...o,
        date: this.toDate(o),
        totalAmount: this.getOrderTotal(o)
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 50); // Aumentamos a 50 para que el balance tenga más historial si se necesita
  });

  formatPrice(p: number) {
    return (p || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
