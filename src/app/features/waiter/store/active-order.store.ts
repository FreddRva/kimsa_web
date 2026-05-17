import { Injectable, signal, computed } from '@angular/core';
import { RestaurantTable } from '../../../core/domain/table/table.model';

@Injectable()
export class ActiveOrderStore {
  selectedTable = signal<RestaurantTable | null>(null);
  isDelivery = signal(false);
  customerName = signal<string | null>(null);
  toastMessage = signal<string | null>(null);

  hasDestination = computed(() => !!this.selectedTable() || this.isDelivery());

  setTable(table: RestaurantTable) {
    this.selectedTable.set(table);
    this.isDelivery.set(false);
  }

  setDelivery() {
    this.isDelivery.set(true);
    this.selectedTable.set(null);
  }

  clearTable() {
    this.selectedTable.set(null);
  }
  clearDelivery() {
    this.isDelivery.set(false);
    this.customerName.set(null);
  }

  reset() {
    this.selectedTable.set(null);
    this.isDelivery.set(false);
    this.customerName.set(null);
  }

  showToast(msg: string, ms = 2800) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), ms);
  }
}
