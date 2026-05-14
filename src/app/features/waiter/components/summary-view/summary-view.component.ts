import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPePipe } from '../../../../shared/pipes/currency-pe.pipe';
import { RestaurantTable } from '../../../../shared/models/table.interface';

@Component({
  selector: 'waiter-summary-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, CurrencyPePipe],
  templateUrl: './summary-view.component.html',
})
export class SummaryViewComponent {
  @Input() items: any[] = [];
  @Input() total: number = 0;
  @Input() selectedTable: RestaurantTable | null = null;
  @Input() isDelivery: boolean = false;
  @Input() currentDateTime: string = '';

  @Output() updateQty = new EventEmitter<{id: string, qty: number}>();
  @Output() updateNotes = new EventEmitter<{id: string, notes: string}>();
  @Output() removeItem = new EventEmitter<string>();
  @Output() sendToKitchen = new EventEmitter<void>();
  @Output() onReset = new EventEmitter<void>();
}
