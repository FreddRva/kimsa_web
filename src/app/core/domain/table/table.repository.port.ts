import { Observable } from 'rxjs';
import { RestaurantTable, TableStatus } from './table.model';

export interface TableRepositoryPort {
  getTables(): Observable<RestaurantTable[]>;
  updateTableStatus(id: string, status: TableStatus, orderId?: string): Promise<void>;
  addTable(data: Partial<RestaurantTable>): Promise<unknown>;
  deleteTable(id: string): Promise<void>;
  updateTable(id: string, data: Partial<RestaurantTable>): Promise<void>;
}
