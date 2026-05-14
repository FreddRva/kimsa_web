import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'k-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class KHeaderComponent {
  /** Barra completa (mozo/caja) vs cabecera tipo Flutter admin */
  @Input() shell: 'default' | 'admin' = 'default';
  @Input() appearance: 'light' | 'dark' = 'dark';
  @Input() title: string = '';
  @Input() userName: string = 'Usuario';
  @Input() userRole: string = 'Staff';
  @Input() unreadCount: number = 0;
  
  @Output() logout = new EventEmitter<void>();
  @Output() notificationsClick = new EventEmitter<void>();

  menuOpen = signal(false);
}
