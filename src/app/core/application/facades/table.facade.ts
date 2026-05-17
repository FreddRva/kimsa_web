import { Injectable, inject, signal } from '@angular/core';
import { TABLE_REPOSITORY_TOKEN } from '../../infrastructure/table.token';
import { RestaurantTable, TableStatus } from '../../domain/table/table.model';

@Injectable({ providedIn: 'root' })
export class TableFacade {
  private repository = inject(TABLE_REPOSITORY_TOKEN);

  tables = signal<RestaurantTable[]>([]);
  loading = signal<boolean>(false);

  constructor() {
    this.loadTables();
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
