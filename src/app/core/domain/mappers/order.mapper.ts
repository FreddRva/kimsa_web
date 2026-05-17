import { Order, OrderStatus, OrderItem } from '../order/order.model';
import { FirestoreTimestampInput, normalizeTimestamp } from '../shared/timestamp.model';

export type FirestoreOrderItem = {
  productId?: string;
  name?: string;
  price?: number;
  quantity?: number;
  notes?: string;
  variation?: string;
};

export type FirestoreOrderDoc = {
  id: string;
  tableId?: string;
  tableName?: string;
  tableNumber?: string | number;
  waiterId?: string;
  waiterName?: string;
  status?: OrderStatus;
  items?: FirestoreOrderItem[];
  total?: number;
  timestamp?: FirestoreTimestampInput;
  createdAt?: FirestoreTimestampInput;
  paidAt?: FirestoreTimestampInput;
  paymentMethod?: string;
  isDelivery?: boolean;
  customerName?: string;
  documentType?: string;
  customerDocument?: string;
};

export class OrderMapper {
  static fromFirestore(doc: FirestoreOrderDoc): Order {
    if (!doc.id) {
      throw new Error('OrderMapper: Documento de Firestore inválido - Falta el campo ID.');
    }

    const timestamp = normalizeTimestamp(doc.timestamp ?? doc.createdAt) ?? new Date();
    const paidAt = doc.paidAt ? (normalizeTimestamp(doc.paidAt) ?? undefined) : undefined;

    // Sanitiza meticulosamente la lista de productos comprados para evitar inconsistencias en runtime
    const sanitizedItems: OrderItem[] = (doc.items ?? []).map((item) => ({
      productId: item.productId ?? '',
      name: item.name ?? 'Producto sin nombre',
      price: item.price ?? 0,
      quantity: item.quantity ?? 1,
      notes: item.notes ?? '',
      variation: item.variation ?? '',
    }));

    return {
      id: doc.id,
      tableId: doc.tableId,
      tableName: doc.tableName,
      tableNumber: doc.tableNumber,
      waiterId: doc.waiterId ?? '',
      waiterName: doc.waiterName ?? '',
      status: doc.status ?? 'pending',
      items: sanitizedItems,
      total: doc.total ?? 0,
      timestamp,
      paidAt,
      paymentMethod: doc.paymentMethod,
      isDelivery: doc.isDelivery ?? false,
      customerName: doc.customerName ?? 'Cliente',
      documentType: doc.documentType,
      customerDocument: doc.customerDocument,
    };
  }
}
