import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { KCardComponent } from '../../../../ui/card/card.component';
import { KPageHeaderComponent } from '../../../../ui/page-header/page-header.component';

@Component({
  selector: 'cashier-history-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, KCardComponent, KPageHeaderComponent],
  templateUrl: './history-view.component.html'
})
export class HistoryViewComponent {
  @Input() paidOrders: any[] = [];
  @Input() cancelledOrders: any[] = [];
  @Input() totalDay = 0;

  currentFilter = signal('Todos');

  get filteredOrders() {
    const f = this.currentFilter();
    if (f === 'ANULADOS') return this.cancelledOrders;
    if (f === 'Todos') return this.paidOrders;
    return this.paidOrders.filter(o => o.paymentMethod?.toUpperCase() === f.toUpperCase());
  }

  formatPrice(p: number) { return (p || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 }); }
  formatFullDateTime(ts: any) {
    if (!ts) return '--/--';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${d.getDate()} ${months[d.getMonth()]}, ${d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
  }
}
