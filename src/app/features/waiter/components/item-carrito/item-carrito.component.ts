import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';

import { CartItem } from '../../store/cart.store';

@Component({
  selector: 'k-item-carrito',
  standalone: true,
  imports: [DecimalPipe, KCardComponent, KButtonComponent],
  templateUrl: './item-carrito.component.html',
})
export class ItemCarritoComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() onAdd = new EventEmitter<void>();
  @Output() onRemove = new EventEmitter<void>();
  @Output() updateNotes = new EventEmitter<string>();

  onUpdateNotes(notes: string) {
    this.updateNotes.emit(notes);
  }
}
