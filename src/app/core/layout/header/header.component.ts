import { Component, Input, Output, EventEmitter, signal, HostListener } from '@angular/core';
import { NotificationCenterComponent } from '../notification-center/notification-center.component';

@Component({
  selector: 'k-header',
  standalone: true,
  imports: [NotificationCenterComponent],
  templateUrl: './header.component.html',
})
export class KHeaderComponent {
  @Input() title: string = '';
  @Input() userName: string = '';
  @Input() userRole: string = '';
  @Input() unreadCount: number = 0;
  @Input() appearance: 'light' | 'dark' | 'glass' = 'glass';
  @Input() shell: 'default' | 'admin' | 'cashier' = 'default';

  @Output() logout = new EventEmitter<void>();

  isOnline = signal(navigator.onLine);
  isMenuOpen = signal(false);
  isNotificationsOpen = signal(false);

  @HostListener('window:online')
  onOnline() {
    this.isOnline.set(true);
  }

  @HostListener('window:offline')
  onOffline() {
    this.isOnline.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container') && !target.closest('.notifications-container')) {
      this.isMenuOpen.set(false);
      this.isNotificationsOpen.set(false);
    }
  }

  toggleMenu() {
    this.isNotificationsOpen.set(false);
    this.isMenuOpen.update((v) => !v);
  }

  toggleNotifications() {
    this.isMenuOpen.set(false);
    this.isNotificationsOpen.update((v) => !v);
  }

  onLogout() {
    this.isMenuOpen.set(false);
    this.logout.emit();
  }
}
