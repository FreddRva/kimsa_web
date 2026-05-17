import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TableFacade } from '../../../../core/application/facades/table.facade';
import { OrderFacade } from '../../../../core/application/facades/order.facade';
import { RestaurantTable } from '../../../../core/domain/table/table.model';
import { KCardComponent } from '../../../../ui/base/card/card.component';

@Component({
  selector: 'app-dialogo-mesa',
  standalone: true,
  imports: [KCardComponent],
  templateUrl: './dialogo-mesa.component.html'
})
export class DialogoMesaComponent {
  private dialogRef = inject(MatDialogRef<DialogoMesaComponent>);
  private tableFacade = inject(TableFacade);
  private orderFacade = inject(OrderFacade);
  
  tables = this.tableFacade.tables;

  getTableActiveItems(tableId: string): string {
    const activeOrder = this.orderFacade.activeOrders().find(o => 
      (o.tableId === tableId || String(o.tableNumber) === String(tableId)) && 
      o.status !== 'paid' && 
      o.status !== 'cancelled'
    );
    if (!activeOrder || !activeOrder.items || activeOrder.items.length === 0) return '';
    return activeOrder.items.map(i => `${i.quantity}x ${i.name}${i.notes ? ` (${i.notes})` : ''}`).join(', ');
  }

  selectTable(table: RestaurantTable) {
    this.dialogRef.close({ type: 'table', data: table });
  }

  onLlevar() {
    this.dialogRef.close({ type: 'delivery' });
  }

  onClose() {
    this.dialogRef.close();
  }
}
