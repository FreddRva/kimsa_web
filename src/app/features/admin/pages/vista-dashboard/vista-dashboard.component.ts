import { Component, inject, computed } from '@angular/core';
import { DashboardFacade } from '../../../../core/application/facades/dashboard.facade';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { EstadisticaDashboardComponent } from '../../widgets/estadistica-dashboard/estadistica-dashboard.component';
import { TransaccionesDashboardComponent } from '../../widgets/transacciones-dashboard/transacciones-dashboard.component';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KReportTemplateComponent } from '../../../../ui/reports/report-template/report-template.component';
import { KReportFinanceSummaryComponent } from '../../../../ui/reports/report-finance-summary/report-finance-summary.component';


@Component({
  selector: 'vista-dashboard',
  standalone: true,
  imports: [
    KPageHeaderComponent,
    EstadisticaDashboardComponent,
    TransaccionesDashboardComponent,
    KCardComponent,
    KBadgeComponent,
    KButtonComponent,
    KReportTemplateComponent,
    KReportFinanceSummaryComponent
  ],
  templateUrl: './vista-dashboard.component.html',
  styles: [`
    @media print {
      body * { visibility: hidden; }
      #ticket-print, #ticket-print * { visibility: visible; }
      #ticket-print { 
        position: absolute; 
        left: 0; top: 0; 
        width: 210mm;
        padding: 20mm;
        color: black !important;
        background: white !important;
        font-family: 'Inter', sans-serif !important;
      }
      @page { size: A4; margin: 0mm; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th { text-align: left; border-bottom: 2px solid #eee; padding: 10px 5px; font-size: 10px; font-weight: 900; }
      td { padding: 10px 5px; border-bottom: 1px solid #f5f5f5; font-size: 10px; }
      .text-right { text-align: right; }
    }
    #ticket-print { visibility: hidden; position: fixed; left: -9999px; }
  `]
})
export class VistaDashboardComponent {
  public facade = inject(DashboardFacade);
  today = new Date();

  stats = this.facade.stats;
  weeklySales = this.facade.weeklySales;
  topProducts = this.facade.topProducts;
  recentTransactions = this.facade.recentTransactions;

  // Órdenes filtradas por día contable para el reporte impreso
  shiftOrders = computed(() => {
    const todayAccountingStr = this.facade.getAccountingDate(new Date());
    return this.recentTransactions().filter(o => {
      return this.facade.getAccountingDate(o.date) === todayAccountingStr;
    });
  });

  onPrint() {
    window.print();
  }

  formatPrice(price: number) {
    return this.facade.formatPrice(price);
  }

  formatTime(date: Date) {
    if (!date) return '--:--';
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }
}
