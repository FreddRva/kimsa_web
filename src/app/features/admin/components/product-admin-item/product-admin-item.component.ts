import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';

import { Product } from '../../../../core/domain/product/product.model';

@Component({
  selector: 'product-admin-item',
  standalone: true,
  imports: [DecimalPipe, KBadgeComponent, KButtonComponent],
  templateUrl: './product-admin-item.component.html'
})
export class ProductAdminItemComponent {
  @Input({ required: true }) product!: Product;
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();
}
