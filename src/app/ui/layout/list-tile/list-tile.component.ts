import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'k-list-tile',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div
      [class]="
        'flex items-center gap-5 p-5 rounded-[24px] border transition-all group ' +
        getVariantClass()
      "
      [class.cursor-pointer]="clickable"
      (click)="clickable ? kClick.emit($event) : null"
    >
      <!-- LEADING (Icon or Image) -->
      @if (icon || image) {
        <div
          class="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden shrink-0 group-hover:bg-green-600/10 transition-colors"
        >
          @if (icon && !image) {
            <mat-icon class="text-white/20 group-hover:text-green-600 transition-colors">{{
              icon
            }}</mat-icon>
          }
          @if (image) {
            <img [src]="image" class="w-full h-full object-cover" />
          }
        </div>
      }

      <!-- CONTENT -->
      <div class="flex flex-col flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span
            class="text-[15px] font-black tracking-tight text-white/90 group-hover:text-green-600 transition-colors truncate"
          >
            {{ title }}
          </span>
          <ng-content select="[title-extra]"></ng-content>
        </div>
        @if (subtitle) {
          <span class="text-[10px] font-black opacity-30 uppercase tracking-widest truncate">
            {{ subtitle }}
          </span>
        }
      </div>

      <!-- TRAILING -->
      <div class="flex items-center gap-4 shrink-0">
        <ng-content select="[trailing]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class KListTileComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() image?: string;
  @Input() variant: 'glass' | 'ghost' | 'surface' = 'surface';
  @Input() clickable: boolean = false;

  @Output() kClick = new EventEmitter<MouseEvent>();

  getVariantClass() {
    switch (this.variant) {
      case 'glass':
        return 'bg-white/[0.03] border-white/5 hover:bg-white/[0.08]';
      case 'ghost':
        return 'bg-transparent border-transparent hover:bg-white/5';
      default:
        return 'bg-white/[0.02] border-white/5 hover:border-green-600/30';
    }
  }
}
