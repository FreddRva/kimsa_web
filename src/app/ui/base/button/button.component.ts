import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'k-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class KButtonComponent {
  @Input() variant: 'primary' | 'danger' | 'ghost' | 'glass' | 'luxury' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() customClass = '';

  @Output() kClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.kClick.emit(event);
    }
  }

  getVariantClass() {
    switch (this.variant) {
      case 'primary':
        return 'bg-gradient-to-br from-k-green to-k-green-dark text-white shadow-[0_10px_30px_-5px_rgba(22,163,74,0.4)] rounded-2xl border border-k-green-light/20 hover:shadow-[0_15px_40px_-5px_rgba(22,163,74,0.6)] hover:-translate-y-1';

      case 'luxury':
        return 'bg-k-gold text-black shadow-[0_10px_40px_-5px_rgba(212,175,55,0.4)] rounded-3xl border border-white/20 hover:shadow-[0_20px_50px_-10px_rgba(212,175,55,0.6)] hover:-translate-y-1.5 active:scale-95';

      case 'danger':
        return 'bg-gradient-to-br from-k-red to-k-red-dark text-white shadow-[0_10px_30px_-5px_rgba(224,47,47,0.4)] rounded-2xl border border-white/10 hover:-translate-y-1';

      case 'glass':
        return 'bg-white/[0.03] backdrop-blur-xl text-white border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:border-white/20';

      case 'ghost':
        return 'bg-transparent text-white/40 hover:text-white hover:bg-white/5 rounded-xl';

      default:
        return '';
    }
  }

  getSizeClass() {
    switch (this.size) {
      case 'sm':
        return 'px-5 py-2.5 text-[10px]';
      case 'md':
        return 'px-8 py-4 text-[11px]';
      case 'lg':
        return 'px-14 py-6 text-[14px]';
      default:
        return '';
    }
  }
}
