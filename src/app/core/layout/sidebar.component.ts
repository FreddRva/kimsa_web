import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavItem {
  id: number;
  label: string;
  icon: string;
  section?: string;
}

@Component({
  selector: 'k-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="w-[280px] bg-black border-r border-white/5 flex flex-col h-full z-50">
      <!-- BRANDING -->
      <div class="h-[120px] px-8 flex items-center gap-4">
        <div class="w-12 h-12 bg-gradient-to-br from-k-green to-k-green-dark rounded-2xl flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(22,163,74,0.3)]">
          <span class="material-symbols-rounded text-2xl">restaurant</span>
        </div>
        <div>
          <h1 class="text-xl font-black tracking-[4px] leading-none text-white">KIMSA</h1>
          <p class="text-[9px] font-black opacity-20 tracking-[2px] uppercase mt-1">{{ subtitle }}</p>
        </div>
      </div>

      <!-- NAVIGATION -->
      <nav class="flex-1 px-4 py-6 overflow-y-auto scroll-none flex flex-col gap-1">
        @for (item of items; track item.id; let i = $index) {
          <!-- SECTION LABEL -->
          @if (item.section && (i === 0 || items[i-1].section !== item.section)) {
            <div class="text-[9px] font-black text-k-text-dim tracking-[3px] mt-8 mb-4 ml-4 uppercase">
              {{ item.section }}
            </div>
          }

          <button 
            class="w-full h-14 flex items-center gap-4 px-5 rounded-[18px] transition-all duration-300 group relative"
            [class]="selectedTab === item.id 
              ? 'bg-k-green/10 text-k-green border border-k-green/10' 
              : 'text-k-text-muted hover:bg-white/5 hover:text-white'"
            (click)="tabChange.emit(item.id)">
            
            <span class="material-symbols-rounded text-[20px] transition-transform duration-300 group-hover:scale-110">
              {{ item.icon }}
            </span>
            
            <span class="text-sm font-bold tracking-wide">{{ item.label }}</span>
            
            @if (selectedTab === item.id) {
              <div class="absolute right-5 w-1.5 h-1.5 bg-k-green rounded-full shadow-[0_0_10px_rgba(22,163,74,0.5)]"></div>
            }
          </button>
        }
      </nav>

      <!-- FOOTER -->
      <div class="p-8 border-t border-white/5">
        <div class="glass-morphism p-4 rounded-2xl flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-k-red/20 flex items-center justify-center text-k-red">
            <span class="material-symbols-rounded text-lg">verified_user</span>
          </div>
          <div>
            <p class="text-[10px] font-black text-white/40 tracking-widest uppercase leading-none">Security</p>
            <p class="text-[10px] font-bold text-white mt-1">V 2.0.1</p>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class KSidebarComponent {
  @Input() subtitle: string = 'PANEL';
  @Input() items: NavItem[] = [];
  @Input() selectedTab: number = 0;
  @Output() tabChange = new EventEmitter<number>();
}
