import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CartStore } from '../../store/cart.store';
import { ActiveOrderStore } from '../../store/active-order.store';
import { OrderFacade } from '../../../../core/application/facades/order.facade';
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
      const orderData = {
        items: this.cartStore.items().map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          notes: item.notes ?? '',
          variation: item.variationName ?? ''
        })),
        tableId: this.order.selectedTable()?.id,
        tableName: this.order.selectedTable()?.number ? `Mesa ${this.order.selectedTable()?.number}` : undefined,
        isDelivery: this.order.isDelivery(),
        total: this.cartStore.total()
      };
      
      await this.orderFacade.sendToKitchen(orderData);
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
