import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'k-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [disabled]="disabled || loading"
      [class]="'relative overflow-hidden inline-flex items-center justify-center gap-2 font-black tracking-[0.2em] uppercase transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group ' + 
               getVariantClass() + ' ' + getSizeClass() + ' ' + customClass"
      (click)="onClick($event)"
    >
      <!-- Shine effect on hover -->
      <div class="absolute inset-0 w-1/2 h-full bg-white/10 -skew-x-12 -translate-x-full group-hover:animate-[shine_0.75s_ease-in-out]"></div>
      
      @if (loading) {
        <svg class="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      }
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    @keyframes shine {
      100% { transform: translateX(300%) skewX(-12deg); }
    }
  `]
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
        return 'bg-k-green text-white hover:bg-k-green-dark shadow-[0_10px_20px_-5px_rgba(22,163,74,0.4)] rounded-k-md border border-k-green/20';
      case 'luxury': 
        return 'bg-gradient-to-br from-[#E02F2F] to-[#6E0000] text-white shadow-[0_15px_30px_-5px_rgba(224,47,47,0.4)] rounded-k-md border border-white/10';
      case 'danger': 
        return 'bg-k-red/10 text-k-red hover:bg-k-red/20 border border-k-red/20 rounded-k-md';
      case 'ghost': 
        return 'bg-transparent text-k-text-muted hover:text-k-text hover:bg-white/5 rounded-k-md';
      case 'glass': 
        return 'glass-morphism text-white hover:bg-white/10 rounded-k-md';
      default: return '';
    }
  }

  getSizeClass() {
    switch (this.size) {
      case 'sm': return 'px-4 py-2 text-[10px]';
      case 'md': return 'px-8 py-4 text-[11px]';
      case 'lg': return 'px-12 py-6 text-[14px]';
      default: return '';
    }
  }
}
