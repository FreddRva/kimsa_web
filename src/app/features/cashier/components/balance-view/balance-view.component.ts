import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { KCardComponent } from '../../../../ui/card/card.component';
import { KPageHeaderComponent } from '../../../../ui/page-header/page-header.component';

@Component({
  selector: 'cashier-balance-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, KCardComponent, KPageHeaderComponent],
  templateUrl: './balance-view.component.html'
})
export class BalanceViewComponent {
  @Input() stats: any = { total: 0, cash: 0, card: 0, digital: 0, cancelled: 0 };

  @Output() onPrint = new EventEmitter<void>();
  @Output() onCloseShift = new EventEmitter<void>();

  formatPrice(p: number) { return (p || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 }); }
}
