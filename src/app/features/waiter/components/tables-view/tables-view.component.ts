import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KCardComponent } from '../../../../ui/card/card.component';
import { KButtonComponent } from '../../../../ui/button/button.component';
import { RestaurantTable } from '../../../../shared/models/table.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'waiter-tables-view',
  standalone: true,
  imports: [CommonModule, KCardComponent, KButtonComponent, MatIconModule],
  templateUrl: './tables-view.component.html'
})
export class TablesViewComponent {
  @Input() tables: RestaurantTable[] = [];
  @Output() selectTable = new EventEmitter<RestaurantTable>();
  @Output() onDelivery = new EventEmitter<void>();
}
