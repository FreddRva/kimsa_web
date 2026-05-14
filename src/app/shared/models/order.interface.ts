export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'waiting_payment' | 'paid' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  variation?: string;
}

export interface Order {
  id: string;
  tableId?: string;
  tableName?: string;
  tableNumber?: string | number;
  waiterId: string;
  waiterName: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  timestamp: any;
  paidAt?: any;
  paymentMethod?: string;
  isDelivery: boolean;
  customerName?: string;
  documentType?: string;
  customerDocument?: string;
}
