import { Component, Input } from '@angular/core';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';
import { Customer } from '../../../../core/domain/customer/customer.model';

@Component({
  selector: 'customer-item',
  standalone: true,
  imports: [KBadgeComponent],
  templateUrl: './customer-item.component.html'
})
export class CustomerItemComponent {
  @Input({ required: true }) customer!: Customer;
}
