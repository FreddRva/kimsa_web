import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'k-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="flex justify-between items-center mb-10">
      <div class="flex flex-col">
        <h2 class="text-[28px] font-black tracking-tighter m-0 text-white">{{ title }}</h2>
        @if (subtitle) {
          <p class="text-[13px] opacity-30 mt-1.5 font-black uppercase tracking-[3px]">{{ subtitle }}</p>
        }
      </div>
      <div class="flex items-center gap-4">
        <ng-content select="[actions]"></ng-content>
      </div>
    </header>
  `
})
export class KPageHeaderComponent {
  @Input({ required: true }) title: string = '';
  @Input() subtitle?: string;
}
