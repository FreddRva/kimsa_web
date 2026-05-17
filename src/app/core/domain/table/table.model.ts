export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface RestaurantTable {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  orderId?: string; 
  zone?: string; 
}
