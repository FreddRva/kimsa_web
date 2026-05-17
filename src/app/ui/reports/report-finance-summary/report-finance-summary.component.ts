import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DashboardStats } from '../../../core/application/facades/dashboard.facade';

@Component({
  selector: 'k-report-finance-summary',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="mb-10 animate-fade">
      <h3 class="text-xs font-black uppercase tracking-[3px] mb-4">{{ title }}</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="border border-black/5 p-4 rounded-xl flex justify-between items-center">
          <span class="text-[10px] font-black opacity-40 uppercase">Efectivo</span>
          <span class="font-black italic">S/ {{ stats.cash || 0 | number: '1.2-2' }}</span>
        </div>
        <div class="border border-black/5 p-4 rounded-xl flex justify-between items-center">
          <span class="text-[10px] font-black opacity-40 uppercase">Tarjeta</span>
          <span class="font-black italic">S/ {{ stats.card || 0 | number: '1.2-2' }}</span>
        </div>
        <div class="border border-black/5 p-4 rounded-xl flex justify-between items-center">
          <span class="text-[10px] font-black opacity-40 uppercase">Digital / Yape</span>
          <span class="font-black italic">S/ {{ stats.digital || 0 | number: '1.2-2' }}</span>
        </div>
        <div class="bg-black text-white p-4 rounded-xl flex justify-between items-center">
          <span class="text-[10px] font-black opacity-60 uppercase">Total Turno</span>
          <span class="text-xl font-black">S/ {{ stats.todaySales || 0 | number: '1.2-2' }}</span>
        </div>
      </div>
    </div>
  `,
})
export class KReportFinanceSummaryComponent {
  @Input({ required: true }) stats!: DashboardStats;
  @Input() title: string = 'Resumen Financiero (Turno Actual)';
}
