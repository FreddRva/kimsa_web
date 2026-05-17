import { Observable } from 'rxjs';
import { Order, OrderStatus } from './order.model';

export interface OrderRepositoryPort {
  getActiveOrders(): Observable<Order[]>;
  getPaidOrders(): Observable<Order[]>;
  getCancelledOrders(): Observable<Order[]>;
  confirmPayment(orderId: string, method: string, tableId?: string, docType?: string, docNumber?: string): Promise<void>;
  cancelOrder(orderId: string, tableId?: string): Promise<void>;
  sendToKitchen(orderData: Partial<Order>): Promise<unknown>;
}
