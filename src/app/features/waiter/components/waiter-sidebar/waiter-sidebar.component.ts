import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../../../shared/models';

@Component({
  selector: 'waiter-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waiter-sidebar.component.html',
})
export class WaiterSidebarComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategory = '';
  @Output() categorySelected = new EventEmitter<string>();

  iconFor(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('pizza')) return 'local_pizza';
    if (n.includes('burger') || n.includes('hamburg')) return 'lunch_dining';
    if (n.includes('bebida') || n.includes('drink')) return 'local_drink';
    if (n.includes('pasta')) return 'dinner_dining';
    return 'fastfood';
  }

  activeCats(): Category[] {
    return this.categories.filter((c) => c.isActive !== false);
  }
}
