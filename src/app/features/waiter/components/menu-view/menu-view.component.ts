import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../../../shared/models';
import { RestaurantTable } from '../../../../shared/models/table.interface';

@Component({
  selector: 'waiter-menu-view',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './menu-view.component.html',
})
export class MenuViewComponent {
  @Input() products: Product[] = [];
  @Input() selectedCategory = '';
  @Input() isPopular = true;
  @Input() selectedTable: RestaurantTable | null = null;
  @Input() isDelivery = false;
  @Input() customerName: string | null = null;

  @Output() mesaChip = new EventEmitter<void>();
  @Output() llevarChip = new EventEmitter<void>();
  @Output() popularChip = new EventEmitter<void>();
  @Output() addItem = new EventEmitter<Product>();
  @Output() showDetails = new EventEmitter<Product>();

  mesaLocked(): boolean {
    return this.isDelivery;
  }

  llevarLocked(): boolean {
    return !!this.selectedTable;
  }

  mesaActive(): boolean {
    return !!this.selectedTable;
  }

  llevarActive(): boolean {
    return this.isDelivery;
  }

  mesaLabel(): string {
    if (this.selectedTable) return `MESA ${this.selectedTable.number}  ✕`;
    return 'MESA';
  }

  llevarLabel(): string {
    if (this.isDelivery && this.customerName) return `${this.customerName.toUpperCase()}  ✕`;
    return 'LLEVAR';
  }

  watermark(): string {
    return this.isPopular ? 'POPULARES' : (this.selectedCategory || '').toUpperCase();
  }

  productImage(p: Product): string {
    return p.imageUrl || p.image || '';
  }

  formatPrice(p: number) {
    return (p || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 });
  }

  addWithVariation(p: Product, v: { name?: string; price?: number } | Record<string, unknown>) {
    const nm = String((v as any).name ?? '');
    const pr = Number((v as any).price ?? 0);
    this.addItem.emit({
      ...p,
      id: `${p.id}-${nm}`,
      price: pr,
      name: `${p.name} (${nm.toUpperCase()})`,
      variationName: nm,
    } as Product);
  }
}
