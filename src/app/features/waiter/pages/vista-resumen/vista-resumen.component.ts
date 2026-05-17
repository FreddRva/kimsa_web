import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CartStore } from '../../store/cart.store';
import { ActiveOrderStore } from '../../store/active-order.store';
import { OrderFacade } from '../../../../core/application/facades/order.facade';
import { TableFacade } from '../../../../core/application/facades/table.facade';
import { AuthService } from '../../../../core/auth/auth.service';
import { Order, OrderStatus } from '../../../../core/domain/order/order.model';
import { PrintingService } from '../../../../core/services/printing.service';
import { ProductFacade } from '../../../../core/application/facades/product.facade';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { ItemCarritoComponent } from '../../components/item-carrito/item-carrito.component';

@Component({
  selector: 'vista-resumen',
  standalone: true,
  imports: [
    DecimalPipe, 
    KCardComponent, 
    KButtonComponent,
    ItemCarritoComponent
  ],
  templateUrl: './vista-resumen.component.html',
})
export class VistaResumenComponent {
  cartStore = inject(CartStore);
  order = inject(ActiveOrderStore);
  private orderFacade = inject(OrderFacade);
  private tableFacade = inject(TableFacade);
  private authService = inject(AuthService);
  private printingService = inject(PrintingService);
  public productFacade = inject(ProductFacade);

  isSending = signal(false);

  onUpdateQty(id: string, qty: number) {
    if (qty <= 0) {
      this.cartStore.removeItem(id);
    } else {
      this.cartStore.updateQuantity(id, qty);
    }
  }

  onReset() {
    this.cartStore.clearCart();
    this.order.reset();
  }

  async onSendToKitchen() {
    if (!this.order.hasDestination()) return;
    
    this.isSending.set(true);
    try {
      const currentUser = this.authService.currentUserData();
      const orderData: Partial<Order> = {
        items: this.cartStore.items().map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          notes: item.notes ?? '',
          variation: item.variationName ?? '',
          // Campos de compatibilidad con Flutter
          productName: item.name,
          unitPrice: item.price,
          totalItemPrice: item.price * item.quantity,
          station: item.station ?? '1',
          status: 'pending',
          components: item.components ?? []
        })),
        tableId: this.order.selectedTable()?.id,
        tableName: this.order.selectedTable()?.number ? `Mesa ${this.order.selectedTable()?.number}` : undefined,
        tableNumber: this.order.selectedTable()?.number,
        isDelivery: this.order.isDelivery(),
        total: this.cartStore.total(),
        status: 'pending',
        timestamp: new Date(),
        waiterId: currentUser?.id || currentUser?.uid || '',
        waiterName: currentUser?.name || 'Mozo'
      };

      // Eliminar cualquier propiedad 'undefined' para evitar que Firestore rechace el guardado en producción
      const cleanOrderData: Partial<Order> = {};
      Object.keys(orderData).forEach(key => {
        const val = (orderData as any)[key];
        if (val !== undefined) {
          (cleanOrderData as any)[key] = val;
        }
      });
      
      await this.orderFacade.sendToKitchen(cleanOrderData);
      
      // Imprimir la comanda de cocina de forma inmediata y automática
      try {
        this.printingService.printKitchenComanda(cleanOrderData as Order);
      } catch (printErr) {
        console.error('Error al imprimir comanda de cocina:', printErr);
      }
      
      // Si el pedido es para salón, cambiar el estado de la mesa a ocupado en la base de datos
      if (!cleanOrderData.isDelivery && cleanOrderData.tableId) {
        await this.tableFacade.updateTableStatus(cleanOrderData.tableId, 'occupied');
      }

      this.onReset();
      alert('¡Pedido enviado a cocina!');
    } catch (err) {
      console.error(err);
      alert('Error al enviar el pedido');
    } finally {
      this.isSending.set(false);
    }
  }
}
