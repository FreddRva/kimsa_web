import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';

@Component({
  selector: 'k-order-history-item',
  standalone: true,
  imports: [DecimalPipe, KCardComponent, KBadgeComponent],
  template: `
    <k-card padding="none" radius="xl" customClass="bg-white/[0.02] border-white/5 overflow-hidden group hover:bg-white/[0.04] transition-all">
      <div class="flex items-center p-5 gap-6">
        <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center transition-colors"
             [class.text-red-500]="order.status === 'cancelled'"
             [class.text-k-green]="order.status !== 'cancelled'">
          <span class="material-symbols-rounded text-2xl" [class.opacity-30]="order.status !== 'cancelled'">
            {{ order.status === 'cancelled' ? 'cancel' : 'check_circle' }}
          </span>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3">
            <h3 class="text-sm font-black text-white uppercase tracking-tight">
              {{ order.isDelivery ? (order.customerName || 'PARA LLEVAR') : 'MESA ' + (order.tableNumber || order.tableId) }}
            </h3>
            <k-badge [variant]="order.status === 'cancelled' ? 'danger' : 'success'" size="sm">
              {{ order.status === 'cancelled' ? 'ANULADO' : (order.paymentMethod || 'PAGADO') }}
            </k-badge>
          </div>
          <div class="mt-1 flex items-center gap-3 opacity-30">
            <span class="text-[9px] font-black uppercase">{{ formatDateTime(order.timestamp) }}</span>
            <div class="w-1 h-1 rounded-full bg-white"></div>
            <span class="text-[9px] font-black uppercase">ID: #{{ order.id.slice(0,8).toUpperCase() }}</span>
          </div>
        </div>

        <div class="flex flex-col items-end">
          <span class="text-xl font-black italic" [class.line-through]="order.status === 'cancelled'" [class.opacity-20]="order.status === 'cancelled'">
            S/ {{ (order.total || 0) | number:'1.2-2' }}
          </span>
          <span class="text-[9px] font-black opacity-20 uppercase tracking-widest">{{ order.documentType || 'TICKET' }}</span>
        </div>
      </div>
    </k-card>
  `
})
export class KOrderHistoryItemComponent {
  @Input({ required: true }) order!: any;

  formatDateTime(timestamp: any): string {
    if (!timestamp) return '--/-- --:--';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }
}
