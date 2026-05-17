import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KButtonComponent } from '../../../ui/base/button/button.component';

export interface NavItem {
  id: number;
  label: string;
  icon: string;
  section?: string;
}

@Component({
  selector: 'k-sidebar',
  standalone: true,
  imports: [KButtonComponent],
  templateUrl: './sidebar.component.html',
})
export class KSidebarComponent {
  @Input() appearance: 'light' | 'dark' = 'dark';
  @Input() subtitle: string = 'PANEL';
  @Input() items: NavItem[] = [];
  @Input() selectedTab: number = 0;
  @Output() tabChange = new EventEmitter<number>();
}
