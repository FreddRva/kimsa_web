import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Order } from '../../../../core/domain/order/order.model';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KInputComponent } from '../../../../ui/base/input/input.component';
import { KHoldButtonComponent } from '../../../../ui/feedback/hold-button/hold-button.component';
import { NexusOrderItemComponent } from '../../components/nexus-order-item/nexus-order-item.component';

@Component({
  selector: 'nexus-order-detail',
  standalone: true,
  imports: [DecimalPipe, KCardComponent, KButtonComponent, KInputComponent, KHoldButtonComponent, NexusOrderItemComponent],
  templateUrl: './nexus-order-detail.component.html',
  styles: [`
    .no-scrollbar::-webkit-scrollbar { display: none; }
  `]
})
export class NexusOrderDetailComponent {
  @Input() order: Order | null = null;
  @Input() selectedMethod: number = 0;
  @Input() selectedDocumentType: string = 'Ticket';
  @Input() customerDocument: string = '';

  @Output() cancelOrder = new EventEmitter<Order>();
  @Output() methodChange = new EventEmitter<number>();
  @Output() documentTypeChange = new EventEmitter<string>();
  @Output() customerDocumentChange = new EventEmitter<string>();
  @Output() confirmPayment = new EventEmitter<void>();
}
