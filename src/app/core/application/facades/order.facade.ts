import { Injectable, inject, signal } from '@angular/core';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { ORDER_REPOSITORY_TOKEN } from '../../infrastructure/order.token';
import { Order } from '../../domain/order/order.model';
import { CustomerFacade } from './customer.facade';
import { ProcessPaymentUseCase } from '../use-cases/process-payment.use-case';

@Injectable({ providedIn: 'root' })
export class OrderFacade {
  private repository = inject(ORDER_REPOSITORY_TOKEN);
  private firestore = inject(Firestore);
  private customerFacade = inject(CustomerFacade);
  private processPaymentUC = inject(ProcessPaymentUseCase);

  activeOrders = signal<Order[]>([]);
  paidOrders = signal<Order[]>([]);
  cancelledOrders = signal<Order[]>([]);
  loading = signal<boolean>(false);
  isSunatActive = false;

  constructor() {
    this.loadOrders();
    this.loadSettings();
  }

  private loadOrders() {
    this.loading.set(true);
    this.repository.getActiveOrders().subscribe({
      next: (data) => { this.activeOrders.set(this.sortOrders(data)); this.loading.set(false); },
      error: (err) => { console.error(err); this.loading.set(false); }
    });
    this.repository.getPaidOrders().subscribe({ next: (data) => this.paidOrders.set(this.sortOrders(data)) });
    this.repository.getCancelledOrders().subscribe({ next: (data) => this.cancelledOrders.set(this.sortOrders(data)) });
  }

  private sortOrders(orders: Order[]): Order[] {
    return orders.sort((a, b) => {
      const getMs = (t: any) => {
        if (!t) return 0;
        if (t instanceof Date) return t.getTime();
        if (typeof t.toDate === 'function') return t.toDate().getTime();
        if (t.seconds) return t.seconds * 1000;
        return new Date(t).getTime();
      };
      return getMs(b.timestamp) - getMs(a.timestamp);
    });
  }

  async loadSettings() {
    try {
      const snap = await getDoc(doc(this.firestore, 'settings/general'));
      if (snap.exists()) this.isSunatActive = snap.data()['isSunatActive'] || false;
    } catch (err) { console.error('Error loading settings:', err); }
  }

  async processPayment(order: Order, method: string, docType: string, docNumber: string): Promise<void> {
    this.loading.set(true);
    try {
      await this.processPaymentUC.execute(order, method, docType, docNumber);
    } finally {
      this.loading.set(false);
    }
  }

  async confirmPayment(orderId: string, method: string, tableId?: string, docType?: string, docNumber?: string) {
    this.loading.set(true);
    try { await this.repository.confirmPayment(orderId, method, tableId, docType, docNumber); }
    finally { this.loading.set(false); }
  }

  async cancelOrder(orderId: string, tableId?: string) {
    this.loading.set(true);
    try { await this.repository.cancelOrder(orderId, tableId); }
    finally { this.loading.set(false); }
  }

  async sendToKitchen(orderData: Partial<Order>) {
    this.loading.set(true);
    try { await this.repository.sendToKitchen(orderData); }
    finally { this.loading.set(false); }
  }
}

