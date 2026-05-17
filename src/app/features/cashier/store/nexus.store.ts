import { Injectable, signal, computed } from '@angular/core';
import { Order } from '../../../core/domain/order/order.model';

@Injectable()
export class NexusStore {
  // State
  private _filter = signal('TODAS');
  private _selectedOrderId = signal<string | null>(null);
  private _selectedOrder = signal<Order | null>(null);
  private _selectedMethod = signal(0);
  private _selectedDocumentType = signal('Ticket');
  private _customerDocument = signal('');

  // Expose signals
  filter = computed(() => this._filter());
  selectedOrderId = computed(() => this._selectedOrderId());
  selectedOrder = computed(() => this._selectedOrder());
  selectedMethod = computed(() => this._selectedMethod());
  selectedDocumentType = computed(() => this._selectedDocumentType());
  customerDocument = computed(() => this._customerDocument());

  // Actions
  setFilter(f: string) { this._filter.set(f); }
  
  selectOrder(order: Order | null) {
    if (!order) {
      this._selectedOrderId.set(null);
      this._selectedOrder.set(null);
      return;
    }
    this._selectedOrderId.set(order.id);
    this._selectedOrder.set(order);
  }

  setPaymentMethod(index: number) { this._selectedMethod.set(index); }
  setDocumentType(type: string) { this._selectedDocumentType.set(type); }
  setCustomerDocument(doc: string) { this._customerDocument.set(doc); }

  clearSelection() {
    this._selectedOrderId.set(null);
    this._selectedOrder.set(null);
    this._customerDocument.set('');
  }
}
