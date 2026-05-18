import { Component, Input } from '@angular/core';
import { KCardComponent } from '../../../../ui/base/card/card.component';

@Component({
  selector: 'k-estadistica-dashboard',
  standalone: true,
  imports: [KCardComponent],
  template: `
    <k-card padding="lg" radius="xl" customClass="bg-white/[0.02] border-white/5 h-full">
      <div class="flex flex-col gap-4">
        <div [class]="'w-12 h-12 rounded-2xl flex items-center justify-center ' + iconBg">
          <span class="material-symbols-rounded text-3xl">{{ icon }}</span>
        </div>
        <div>
          <p class="text-[10px] font-black opacity-30 uppercase tracking-[3px] mb-1">{{ label }}</p>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-black italic text-white">{{ value }}</span>
          </div>
          @if (footer) {
            <span [class]="'text-[9px] font-black uppercase mb-1.5 ' + footerClass">{{
              footer
            }}</span>
          }
        </div>
      </div>
    </k-card>
  `,
})
export class EstadisticaDashboardComponent {
  @Input() icon: string = '';
  @Input() iconBg: string = '';
  @Input() label: string = '';
  @Input() value: string = '';
  @Input() footer?: string;
  @Input() footerClass: string = 'text-k-green';
}
