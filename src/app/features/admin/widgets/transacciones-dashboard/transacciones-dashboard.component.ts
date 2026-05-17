import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { DashboardTransaction } from '../../../../core/application/facades/dashboard.facade';

@Component({
  selector: 'k-transacciones-dashboard',
  standalone: true,
  imports: [DatePipe, KCardComponent, KButtonComponent],
  template: `
    <k-card padding="lg" radius="xl" customClass="bg-white/[0.01] border-white/5">
      <div class="flex items-center justify-between mb-8">
        <div class="flex flex-col gap-1">
          <span class="text-[10px] font-black opacity-30 uppercase tracking-[4px]">Últimas Transacciones</span>
          <span class="text-[8px] font-bold text-k-green uppercase tracking-widest">Sincronizado en tiempo real</span>
        </div>
        <k-button variant="glass" size="sm">Ver Todo</k-button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-white/5">
              <th class="py-4 px-2 text-[9px] font-black opacity-20 uppercase tracking-[2px]">Hora</th>
              <th class="py-4 px-2 text-[9px] font-black opacity-20 uppercase tracking-[2px]">Mesa / Pedido</th>
              <th class="py-4 px-2 text-[9px] font-black opacity-20 uppercase tracking-[2px]">Estado</th>
              <th class="py-4 px-2 text-[9px] font-black opacity-20 uppercase tracking-[2px] text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            @for (tx of transactions; track tx.id) {
              <tr class="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                <td class="py-4 px-2">
                  <span class="text-[11px] font-bold text-white/60 tracking-tighter italic">{{ tx.date | date:'hh:mm a' }}</span>
                </td>
                <td class="py-4 px-2">
                  <div class="flex flex-col">
                    <span class="text-[12px] font-black text-white italic tracking-tight">Mesa {{ tx.tableName || tx.tableId || 'Delivery' }}</span>
                    <span class="text-[8px] font-bold text-white/20 uppercase tracking-widest">Ref: #{{ tx.id.substring(0,6) }}</span>
                  </div>
                </td>
                <td class="py-4 px-2">
                  <div class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 rounded-full bg-k-green shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                    <span class="text-[10px] font-black text-k-green uppercase tracking-widest">Pagado</span>
                  </div>
                </td>
                <td class="py-4 px-2 text-right">
                  <span class="text-[13px] font-black text-white italic tracking-tighter">S/ {{ formatPrice(tx.totalAmount) }}</span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </k-card>
  `
})
export class TransaccionesDashboardComponent {
  @Input() transactions: DashboardTransaction[] = [];
  @Input() formatPrice: (p: number) => string = (p) => p.toString();
}
