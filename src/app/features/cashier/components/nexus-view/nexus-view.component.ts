import { Component, Input, Output, EventEmitter, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Order, OrderItem } from '../../../../shared/models';

@Component({
  selector: 'cashier-nexus-view',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule
  ],
  templateUrl: './nexus-view.component.html'
})
export class NexusViewComponent implements OnDestroy {
  @Input() orders: Order[] = [];
  @Input() selectedOrderId: string | null = null;
  @Input() selectedOrder: Order | null = null;
  @Input() filter = 'TODAS';
  @Input() selectedMethod = 0;
  
  @Output() filterChange = new EventEmitter<string>();
  @Output() selectOrder = new EventEmitter<Order>();
  @Output() methodChange = new EventEmitter<number>();
  @Output() confirmPayment = new EventEmitter<{ method: number, docType: string, docNumber: string }>();
  @Output() cancelOrder = new EventEmitter<Order>();
  
  // Long press logic
  isPressing = signal(false);
  pressProgress = signal(0);
  
  // Document Type logic
  selectedDocumentType = signal('Ticket');
  customerDocument = signal('');
  private pressInterval: any;
  private pressStartTime: number = 0;
  private readonly PRESS_DURATION = 2000; // 2 seconds

  ngOnDestroy() {
    this.stopPress();
  }

  formatTime(ts: any) {
    if (!ts) return '--:--';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  startPress(event: MouseEvent | TouchEvent) {
    // Solo permitir si hay una orden y está en estado de cobro
    if (!this.selectedOrder || this.selectedOrder.status === 'paid' || this.selectedOrder.status === 'cancelled') return;
    
    // Evitar menú contextual en dispositivos móviles
    event.preventDefault();

    this.isPressing.set(true);
    this.pressProgress.set(0);
    this.pressStartTime = Date.now();

    this.pressInterval = setInterval(() => {
      if (!this.isPressing()) {
        this.stopPress();
        return;
      }

      const elapsed = Date.now() - this.pressStartTime;
      const progress = Math.min(elapsed / this.PRESS_DURATION, 1.0);
      
      this.pressProgress.set(progress);

      if (progress >= 1.0) {
        this.stopPress();
        this.confirmPayment.emit({
          method: this.selectedMethod,
          docType: this.selectedDocumentType(),
          docNumber: this.customerDocument()
        });
      }
    }, 50);
  }

  stopPress() {
    this.isPressing.set(false);
    this.pressProgress.set(0);
    if (this.pressInterval) {
      clearInterval(this.pressInterval);
      this.pressInterval = null;
    }
  }
}
