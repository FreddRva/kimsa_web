import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'nexus-order-item',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './nexus-order-item.component.html'
})
export class NexusOrderItemComponent {
  @Input() item: any;
}
