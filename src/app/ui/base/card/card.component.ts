import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'k-card',
  standalone: true,
  imports: [],
  template: `
    <div 
      [class]="'relative overflow-hidden transition-all duration-500 ' + 
               getVariantClass() + ' ' + 
               (clickable ? 'hover:translate-y-[-4px] cursor-pointer ' : '') + 
               getPaddingClass() + ' ' + getRadiusClass() + ' ' + customClass"
      (click)="clickable ? kClick.emit($event) : null"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class KCardComponent {
  @Input() variant: 'default' | 'glass' | 'luxury' = 'default';
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  @Input() radius: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'xl';
  @Input() clickable = false;
  @Input() set hoverable(v: boolean) { this.clickable = v; } 
  @Input() customClass = '';
  
  @Output() kClick = new EventEmitter<MouseEvent>();

  getVariantClass() {
    switch (this.variant) {
      case 'default': 
        return 'bg-k-surface border border-k-border shadow-premium hover:bg-k-surface-hover';
      case 'glass': 
        return 'glass-morphism shadow-premium hover:bg-white/10';
      case 'luxury': 
        return 'bg-white/[0.03] backdrop-blur-[40px] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]';
      default: return '';
    }
  }

  getPaddingClass() {
    const map = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-10',
      xl: 'p-12'
    };
    return map[this.padding];
  }

  getRadiusClass() {
    if (this.variant === 'luxury') return 'rounded-k-2xl';
    const map = {
      none: 'rounded-none',
      sm: 'rounded-k-sm',
      md: 'rounded-k-md',
      lg: 'rounded-k-lg',
      xl: 'rounded-k-xl'
    };
    return map[this.radius] || 'rounded-k-md';
  }
}
