import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavItem {
  id: number;
  label: string;
  icon: string;
  section?: string;
}

@Component({
  selector: 'k-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
})
export class KSidebarComponent {
  /** `light` = portal admin Flutter (fondo claro); `dark` = POS / caja */
  @Input() appearance: 'light' | 'dark' = 'dark';
  @Input() subtitle: string = 'PANEL';
  @Input() items: NavItem[] = [];
  @Input() selectedTab: number = 0;
  @Output() tabChange = new EventEmitter<number>();
}
