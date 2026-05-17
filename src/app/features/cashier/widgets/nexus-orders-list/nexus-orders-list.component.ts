import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Order } from '../../../../core/domain/order/order.model';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';
import { FirestoreTimestampInput, normalizeTimestamp } from '../../../../core/domain/shared/timestamp.model';

@Component({
  selector: 'nexus-orders-list',
  standalone: true,
  imports: [DecimalPipe, KCardComponent, KButtonComponent, KBadgeComponent],
  templateUrl: './nexus-orders-list.component.html',
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
  `]
})
export class NexusOrdersListComponent {
  @Input() orders: Order[] = [];
  @Input() selectedId: string | null = null;
  @Input() currentFilter: string = 'TODAS';
  
  @Output() select = new EventEmitter<Order>();
  @Output() filterChange = new EventEmitter<string>();

  onFilterChange(f: string) {
    this.filterChange.emit(f);
  }

  formatTime(ts: FirestoreTimestampInput | null | undefined) {
    if (!ts) return '--:--';
    const d = normalizeTimestamp(ts);
    if (!d) return '--:--';
    const timeStr = d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
    const day = d.getDate();
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const monthStr = months[d.getMonth()];
    return `${day}-${monthStr}., ${timeStr}`;
  }
}
