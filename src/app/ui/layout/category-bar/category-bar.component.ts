import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KCardComponent } from '../../base/card/card.component';

export interface KCategoryItem {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'k-category-bar',
  standalone: true,
  imports: [KCardComponent],
  template: `
    <div class="h-full w-24 flex flex-col items-center">
      <k-card
        variant="luxury"
        padding="none"
        radius="xl"
        customClass="h-full w-full flex flex-col items-center py-8"
      >
        <!-- Logo / Top Space -->
        <div class="mb-6 px-3">
          <ng-content select="[top]"></ng-content>
        </div>

        <!-- Scrollable Categories -->
        <div
          class="flex-1 w-full flex flex-col items-center gap-8 overflow-y-auto no-scrollbar px-2 pt-4 pb-10"
        >
          @for (cat of items; track cat.id) {
            <button
              (click)="select.emit(cat.name)"
              class="group relative flex flex-col items-center justify-center gap-1.5 transition-all duration-300"
            >
              <!-- Glow effect when active -->
              @if (selected === cat.name) {
                <div
                  class="absolute inset-0 bg-k-green/20 blur-2xl rounded-full animate-pulse"
                ></div>
              }

              <div
                [class]="
                  'relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border border-transparent ' +
                  (selected === cat.name
                    ? 'bg-k-green text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white')
                "
              >
                <span
                  class="material-symbols-rounded text-2xl group-hover:scale-110 transition-transform"
                >
                  {{ cat.icon }}
                </span>
              </div>
              <span
                [class]="
                  'relative z-10 text-[8px] font-black uppercase tracking-widest text-center truncate w-16 ' +
                  (selected === cat.name ? 'text-k-green' : 'text-white/20')
                "
              >
                {{ cat.name }}
              </span>
            </button>
          }
        </div>

        <!-- Footer Decoration -->
        <div class="w-8 h-1 bg-white/5 rounded-full mt-4 mb-2"></div>
      </k-card>
    </div>
  `,
  styles: [
    `
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `,
  ],
})
export class KCategoryBarComponent {
  @Input() items: KCategoryItem[] = [];
  @Input() selected: string = '';
  @Output() select = new EventEmitter<string>();
}
