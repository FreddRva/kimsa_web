import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'waiter-top-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './waiter-top-bar.component.html',
  styleUrl: './waiter-top-bar.component.css',
})
export class WaiterTopBarComponent {
  @Input() dateTimeLabel = '';
  @Input() searchValue = '';
  @Input() userName = '';
  @Output() searchValueChange = new EventEmitter<string>();
  @Output() logout = new EventEmitter<void>();

  menuOpen = signal(false);

  onSearchInput(ev: Event) {
    const v = (ev.target as HTMLInputElement).value;
    this.searchValueChange.emit(v);
  }

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }

  closeMenuAndLogout() {
    this.menuOpen.set(false);
    this.logout.emit();
  }
}
