export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  orderId?: string; // ID de la orden activa si está ocupada
  zone?: string; // 'terraza', 'salon_1', etc.
}
