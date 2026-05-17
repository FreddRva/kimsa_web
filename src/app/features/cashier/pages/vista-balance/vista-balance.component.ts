import { Component, inject, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DashboardFacade } from '../../../../core/application/facades/dashboard.facade';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KReportTemplateComponent } from '../../../../ui/reports/report-template/report-template.component';
import { KReportFinanceSummaryComponent } from '../../../../ui/reports/report-finance-summary/report-finance-summary.component';
import { KReportTransactionsTableComponent } from '../../../../ui/reports/report-transactions-table/report-transactions-table.component';

@Component({
  selector: 'vista-balance',
  standalone: true,
  imports: [
    DecimalPipe, 
    KPageHeaderComponent, 
    KCardComponent, 
    KButtonComponent, 
    KReportTemplateComponent,
    KReportFinanceSummaryComponent,
    KReportTransactionsTableComponent
  ],
  templateUrl: './vista-balance.component.html',
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
    }
    #ticket-print { visibility: hidden; position: fixed; left: -9999px; }
  `]
})
export class VistaBalanceComponent {
  public dashboardFacade = inject(DashboardFacade);
  today = new Date();

  stats = this.dashboardFacade.stats;
  recentTransactions = this.dashboardFacade.recentTransactions;

  shiftOrders = computed(() => {
    const todayStr = this.dashboardFacade.getAccountingDate(new Date());
    return this.recentTransactions().filter(o => 
      this.dashboardFacade.getAccountingDate(o.date) === todayStr
    );
  });

  onPrint() {
    window.print();
  }

  onCloseShift() {
    const confirmClose = confirm('¿Estás seguro de que deseas cerrar el turno actual? Se generará el reporte final y se bloquearán nuevas órdenes hasta el siguiente turno.');
    if (confirmClose) {
      alert('Funcionalidad de cierre de turno en desarrollo. Se integrará con el sistema de auditoría pronto.');
    }
  }

  formatTime(date: Date | undefined | null) {
    if (!date) return '--:--';
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}
