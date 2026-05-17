import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DashboardTransaction } from '../../../core/application/facades/dashboard.facade';

@Component({
  selector: 'k-report-transactions-table',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="animate-fade">
      <h3 class="text-xs font-black uppercase tracking-[3px] mb-4">{{ title }}</h3>
      <table class="w-full border-collapse">
        <thead>
          <tr>
            <th class="text-left py-2 border-b-2 border-black/10 text-[10px] font-black uppercase">
              Hora
            </th>
            <th class="text-left py-2 border-b-2 border-black/10 text-[10px] font-black uppercase">
              Doc
            </th>
            <th class="text-left py-2 border-b-2 border-black/10 text-[10px] font-black uppercase">
              Descripción
            </th>
            <th class="text-left py-2 border-b-2 border-black/10 text-[10px] font-black uppercase">
              Método
            </th>
            <th class="text-right py-2 border-b-2 border-black/10 text-[10px] font-black uppercase">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          @for (o of orders; track o.id) {
            <tr>
              <td class="py-2 border-b border-black/5 text-[10px]">{{ formatTime(o.date) }}</td>
              <td class="py-2 border-b border-black/5 font-bold text-[9px]">
                #{{ o.id.slice(-6).toUpperCase() }}
              </td>
              <td class="py-2 border-b border-black/5 uppercase text-[10px] font-medium">
                {{ o.tableId === 'delivery' ? 'Llevar' : 'Mesa ' + (o.tableNumber || o.tableId) }}
              </td>
              <td class="py-2 border-b border-black/5 italic font-bold text-[9px]">
                {{ o.paymentMethod }}
              </td>
              <td class="py-2 border-b border-black/5 text-right font-black text-[10px]">
                S/ {{ o.totalAmount | number: '1.2-2' }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class KReportTransactionsTableComponent {
  @Input({ required: true }) orders: DashboardTransaction[] = [];
  @Input() title: string = 'Auditoría de Transacciones';

  formatTime(date: Date | undefined | null) {
    if (!date) return '--:--';
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}
