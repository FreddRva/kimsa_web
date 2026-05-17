import { Component, Input, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'k-select',
  standalone: true,
  templateUrl: './select.component.html',
})
export class KSelectComponent<T> {
  @Input() label?: string;
  @Input() icon?: string;
  @Input() placeholder: string = 'Seleccionar...';
  @Input() options: { label: string; value: T }[] = [];
  @Input() value?: T;
  @Input() customClass: string = '';

  @Output() valueChange = new EventEmitter<T>();

  isOpen = signal(false);

  toggle() {
    this.isOpen.update((v) => !v);
  }

  selectOption(option: { label: string; value: T }) {
    this.value = option.value;
    this.valueChange.emit(this.value);
    this.isOpen.set(false);
  }

  getSelectedLabel(): string {
    const selected = this.options.find((o) => o.value === this.value);
    return selected ? selected.label : this.placeholder;
  }
}
