import { Component, inject, signal, computed, OnDestroy, effect } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Order } from '../../../../core/domain/order/order.model';
import { OrderFacade } from '../../../../core/application/facades/order.facade';
import { PrintingService } from '../../../../core/services/printing.service';
import { NexusOrdersListComponent } from '../../widgets/nexus-orders-list/nexus-orders-list.component';
import { NexusOrderDetailComponent } from '../../widgets/nexus-order-detail/nexus-order-detail.component';
import { NexusStore } from '../../store/nexus.store';

@Component({
  selector: 'vista-nexus',
  standalone: true,
  imports: [
    MatDialogModule, 
    NexusOrdersListComponent, 
    NexusOrderDetailComponent
  ],
  templateUrl: './vista-nexus.component.html'
})
export class VistaNexusComponent implements OnDestroy {
  private orderFacade = inject(OrderFacade);
  private dialog = inject(MatDialog);
  public store = inject(NexusStore);
  private printingService = inject(PrintingService);

  activeOrders = this.orderFacade.activeOrders;

  filteredOrders = computed(() => {
    const f = this.store.filter();
    const orders = this.activeOrders();
    if (f === 'SALÓN') return orders.filter(o => !o.isDelivery);
    if (f === 'PARA LLEVAR') return orders.filter(o => !!o.isDelivery);
    return orders;
  });

  constructor() {
    effect(() => {
      const orders = this.activeOrders();
      if (orders.length > 0 && !this.store.selectedOrderId()) {
        const urgent = orders.find(o => o.status === 'waiting_payment');
        this.store.selectOrder(urgent || orders[0]);
      }
    });
  }

  ngOnDestroy() { }

  async onConfirmPayment() {
    const order = this.store.selectedOrder();
    if (!order) return;
    const methods = ['EFECTIVO', 'TARJETA', 'YAPE'];
    const paymentMethod = methods[this.store.selectedMethod()];
    const docType = this.store.selectedDocumentType();
    const custDoc = this.store.customerDocument();

    await this.orderFacade.processPayment(
      order, 
      paymentMethod, 
      docType, 
      custDoc
    );

    // Imprimir el comprobante térmico de forma 100% automática tras el cobro
    try {
      const updatedOrder = {
        ...order,
        documentType: docType,
        customerDocument: custDoc,
        paymentMethod: paymentMethod
      };
      this.printingService.printReceipt(updatedOrder as Order, paymentMethod);
    } catch (printErr) {
      console.error('Error al imprimir boleta automáticamente:', printErr);
    }

    this.store.clearSelection();
  }

  onPrintOrder(order: Order) {
    if (!order) return;
    const methods = ['EFECTIVO', 'TARJETA', 'YAPE'];
    const paymentMethod = methods[this.store.selectedMethod()];
    const docType = this.store.selectedDocumentType();
    const custDoc = this.store.customerDocument();

    try {
      const tempOrder = {
        ...order,
        documentType: docType,
        customerDocument: custDoc,
        paymentMethod: paymentMethod
      };
      this.printingService.printReceipt(tempOrder as Order, paymentMethod);
    } catch (printErr) {
      console.error('Error al imprimir pre-cuenta:', printErr);
    }
  }

  async onCancelOrder(order: Order) {
    const { ConfirmDialogComponent } = await import('../../../../ui/feedback/confirm-dialog/confirm-dialog.component');
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px', panelClass: 'bg-transparent',
      data: { title: 'Anular Pedido', message: `¿Anular pedido MESA ${order.tableNumber || order.tableId}?`, confirmText: 'SÍ, ANULAR' }
    });
    ref.afterClosed().subscribe(result => {
      if (result) {
        // Imprimir comanda de anulación a cocina (igual a Flutter)
        try {
          this.printingService.printCancellationComanda(order);
        } catch (printErr) {
          console.error('Error al imprimir ticket de anulación:', printErr);
        }

        this.orderFacade.cancelOrder(order.id, order.tableId).then(() => {
          if (this.store.selectedOrderId() === order.id) this.store.clearSelection();
        });
      }
    });
  }
}
