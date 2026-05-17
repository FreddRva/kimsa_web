import { Injectable, inject, signal, effect } from '@angular/core';
import { TABLE_REPOSITORY_TOKEN } from '../../infrastructure/table.token';
import { RestaurantTable, TableStatus } from '../../domain/table/table.model';
import { OrderFacade } from './order.facade';

@Injectable({ providedIn: 'root' })
export class TableFacade {
  private repository = inject(TABLE_REPOSITORY_TOKEN);
  private orderFacade = inject(OrderFacade);

  tables = signal<RestaurantTable[]>([]);
  loading = signal<boolean>(false);

  constructor() {
    this.loadTables();

    // Auto-healing: Reset tables marked as occupied if there are no corresponding active orders
    effect(() => {
      const activeOrders = this.orderFacade.activeOrders();
      const currentTables = this.tables();
      if (this.loading() || this.orderFacade.loading()) return;

      currentTables.forEach(async (table) => {
        if (table.status === 'occupied') {
          const hasActiveOrder = activeOrders.some(o => 
            (o.tableId === table.id || String(o.tableNumber) === String(table.number)) &&
            o.status !== 'paid' &&
            o.status !== 'cancelled'
          );
          if (!hasActiveOrder) {
            console.log(`Auto-healing: Resetting table ${table.number} to available since no active order exists.`);
            await this.updateTableStatus(table.id, 'available');
          }
        }
      });
    });
  }

  private loadTables() {
    this.loading.set(true);
    this.repository.getTables().subscribe({
      next: (data) => {
        this.tables.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  async addTable(data: Partial<RestaurantTable>) {
    await this.repository.addTable(data);
  }

  async updateTable(id: string, data: Partial<RestaurantTable>) {
    await this.repository.updateTable(id, data);
  }

  async deleteTable(id: string) {
    await this.repository.deleteTable(id);
  }

  async updateTableStatus(id: string, status: TableStatus, orderId?: string) {
    await this.repository.updateTableStatus(id, status, orderId);
  }
}
