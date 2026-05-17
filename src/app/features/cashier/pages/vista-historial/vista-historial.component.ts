import { Component, inject, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { OrderFacade } from '../../../../core/application/facades/order.facade';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KOrderHistoryItemComponent } from '../../components/order-history-item/order-history-item.component';

@Component({
  selector: 'vista-historial',
  standalone: true,
  imports: [DecimalPipe, KPageHeaderComponent, KButtonComponent, KOrderHistoryItemComponent],
  templateUrl: './vista-historial.component.html'
})
export class VistaHistorialComponent {
  private orderFacade = inject(OrderFacade);

  paidOrders = this.orderFacade.paidOrders;
  cancelledOrders = this.orderFacade.cancelledOrders;
  totalDay = computed(() => this.paidOrders().reduce((s, o) => s + (o.total || 0), 0));

  currentFilter = signal('Todos');

  filteredOrders = computed(() => {
    const f = this.currentFilter();
    if (f === 'ANULADOS') return this.cancelledOrders();
    if (f === 'Todos') return this.paidOrders();
    return this.paidOrders().filter(o => o.paymentMethod?.toUpperCase() === f.toUpperCase());
  });
}
