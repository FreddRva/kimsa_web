import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { RestaurantTable } from '../../../../core/domain/table/table.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vista-mesas',
  standalone: true,
  imports: [KCardComponent, KButtonComponent, MatIconModule],
  templateUrl: './vista-mesas.component.html'
})
export class VistaMesasComponent {
  @Input() tables: RestaurantTable[] = [];
  @Output() selectTable = new EventEmitter<RestaurantTable>();
  @Output() onDelivery = new EventEmitter<void>();
}
