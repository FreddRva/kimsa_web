import { Component, Input } from '@angular/core';

@Component({
  selector: 'k-badge',
  standalone: true,
  template: `
    <div
      [class]="
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black tracking-widest uppercase ' +
        getVariantClass() +
        ' ' +
        customClass
      "
    >
      @if (dot) {
        <div [class]="'w-1.5 h-1.5 rounded-full ' + getDotClass()"></div>
      }
      <ng-content></ng-content>
    </div>
  `,
})
export class KBadgeComponent {
  @Input() variant: 'success' | 'danger' | 'warning' | 'info' | 'ghost' = 'info';
  @Input() dot = false;
  @Input() customClass = '';

  getVariantClass() {
    switch (this.variant) {
      case 'success':
        return 'bg-k-success/5 text-k-success border-k-success/20';
      case 'danger':
        return 'bg-k-danger/5 text-k-danger border-k-danger/20';
      case 'warning':
        return 'bg-k-warning/5 text-k-warning border-k-warning/20';
      case 'info':
        return 'bg-k-info/5 text-k-info border-k-info/20';
      case 'ghost':
        return 'bg-white/5 text-white/50 border-white/10';
      default:
        return '';
    }
  }

  getDotClass() {
    switch (this.variant) {
      case 'success':
        return 'bg-k-success';
      case 'danger':
        return 'bg-k-danger';
      case 'warning':
        return 'bg-k-warning';
      case 'info':
        return 'bg-k-info';
      case 'ghost':
        return 'bg-white/40';
      default:
        return '';
    }
  }
}
