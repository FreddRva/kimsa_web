import { Component, inject, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { DashboardFacade } from '../../../../core/application/facades/dashboard.facade';
import { PrintingService } from '../../../../core/services/printing.service';
import { Order } from '../../../../core/domain/order/order.model';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';

@Component({
  selector: 'vista-balance',
  standalone: true,
  imports: [
    DecimalPipe, 
    KPageHeaderComponent, 
    KCardComponent, 
    KButtonComponent
  ],
  templateUrl: './vista-balance.component.html'
})
export class VistaBalanceComponent {
  public dashboardFacade = inject(DashboardFacade);
  private printingService = inject(PrintingService);
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
    const cancelled = this.recentTransactions().filter(o => o.status === 'cancelled') as any[] as Order[];
    this.printingService.printDailySummary({
      orders: this.shiftOrders() as any[] as Order[],
      cancelledOrders: cancelled,
      total: this.stats().todaySales,
      cash: this.stats().cash,
      card: this.stats().card,
      digital: this.stats().digital
    });
  }

  loadingClose = false;

  async onCloseShift() {
    if (this.loadingClose) return;
    const confirmClose = confirm('¿Estás seguro de que deseas cerrar el turno actual? Esto guardará de forma oficial este arqueo de caja en la base de datos de auditoría y se imprimirá el resumen.');
    if (!confirmClose) return;

    this.loadingClose = true;
    try {
      await this.dashboardFacade.closeShift(this.stats(), this.shiftOrders());
      alert('¡Turno cerrado y arqueo guardado con éxito! Se procederá a imprimir el reporte automáticamente.');
      this.onPrint();
    } catch (e) {
      console.error(e);
      alert('Ocurrió un error al registrar el cierre de caja.');
    } finally {
      this.loadingClose = false;
    }
  }

  formatTime(date: Date | undefined | null) {
    if (!date) return '--:--';
    return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}
