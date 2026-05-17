import { Component, Input } from '@angular/core';

@Component({
  selector: 'k-page-header',
  standalone: true,
  imports: [],
  template: `
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex items-center gap-5">
        @if (icon) {
          <div
            class="w-14 h-14 rounded-2xl bg-k-green/10 flex items-center justify-center border border-k-green/20"
          >
            <span class="material-symbols-rounded text-k-green text-3xl">{{ icon }}</span>
          </div>
        }
        <div class="flex flex-col">
          <h2 class="text-[28px] font-black tracking-tighter m-0 text-white uppercase">
            {{ title }}
          </h2>
          @if (subtitle) {
            <p class="text-[11px] opacity-30 mt-1 font-black uppercase tracking-[3px]">
              {{ subtitle }}
            </p>
          }
        </div>
      </div>
      <div class="flex items-center gap-4">
        <ng-content></ng-content>
      </div>
    </header>
  `,
})
export class KPageHeaderComponent {
  @Input({ required: true }) title: string = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
}
