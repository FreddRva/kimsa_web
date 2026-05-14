import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private _items = signal<any[]>([]);

  // Computed properties
  items = computed(() => this._items());
  total = computed(() => this._items().reduce((acc, item) => acc + (item.price * item.quantity), 0));
  itemCount = computed(() => this._items().reduce((acc, item) => acc + item.quantity, 0));

  addItem(product: any, qty: number = 1) {
    this._items.update(current => {
      const existingIdx = current.findIndex(i => i.id === product.id);
      if (existingIdx > -1) {
        const updated = [...current];
        updated[existingIdx] = { ...updated[existingIdx], quantity: updated[existingIdx].quantity + qty };
        return updated;
      }
      return [...current, { ...product, quantity: qty }];
    });
  }

  updateQuantity(productId: string, qty: number) {
    this._items.update(current => {
      if (qty <= 0) {
        return current.filter(i => i.id !== productId);
      }
      const existingIdx = current.findIndex(i => i.id === productId);
      if (existingIdx > -1) {
        const updated = [...current];
        updated[existingIdx] = { ...updated[existingIdx], quantity: qty };
        return updated;
      }
      return current;
    });
  }

  updateNotes(productId: string, notes: string) {
    this._items.update(current => {
      const existingIdx = current.findIndex(i => i.id === productId);
      if (existingIdx > -1) {
        const updated = [...current];
        updated[existingIdx] = { ...updated[existingIdx], notes: notes };
        return updated;
      }
      return current;
    });
  }

  removeItem(productId: string) { 
    this._items.update(current => current.filter(i => i.id !== productId)); 
  }

  clearCart() { 
    this._items.set([]); 
  }
}
