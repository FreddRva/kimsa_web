import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'k-toggle',
  standalone: true,
  templateUrl: './toggle.component.html',
})
export class KToggleComponent {
  @Input() checked: boolean = false;
  @Input() label?: string;
  @Input() subtitle?: string;
  @Input() icon?: string;

  @Output() checkedChange = new EventEmitter<boolean>();

  toggle() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
