import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'k-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-[100px] px-10 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-xl z-40">
      <div class="flex flex-col">
        <span class="text-[9px] font-black text-k-green tracking-[3px] uppercase mb-1">Kimsa Management</span>
        <h2 class="text-2xl font-black uppercase tracking-wider text-white">{{ title }}</h2>
      </div>

      <!-- CENTER CONTENT -->
      <div class="flex-1 flex justify-center">
        <ng-content select="[center]"></ng-content>
      </div>

      <div class="flex items-center gap-6">
        <!-- SYNC INDICATOR -->
        <div class="bg-white/5 border border-white/10 px-5 py-2.5 rounded-2xl flex items-center gap-3 text-[10px] font-black text-white/50">
          <div class="w-2 h-2 rounded-full bg-k-green animate-pulse shadow-[0_0_10px_rgba(22,163,74,0.5)]"></div>
          <span class="tracking-widest uppercase">Live Sync</span>
        </div>

        <!-- NOTIFICATIONS -->
        <button class="w-11 h-11 glass-morphism rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white/10 group">
          <span class="material-symbols-rounded text-[22px] text-white/40 group-hover:text-white transition-colors">notifications</span>
          <div class="absolute top-2.5 right-2.5 w-2 h-2 bg-k-red rounded-full border-2 border-black"></div>
        </button>

        <!-- USER MENU -->
        <div class="relative">
          <button 
            class="h-[56px] glass-morphism px-2 py-2 pr-5 rounded-2xl flex items-center text-white gap-3 cursor-pointer transition-all duration-300 hover:border-white/20" 
            (click)="menuOpen.set(!menuOpen())">
            <div class="w-10 h-10 bg-gradient-to-br from-k-green to-k-green-dark rounded-[14px] flex items-center justify-center font-black text-white shadow-lg">
              {{ userName.charAt(0).toUpperCase() }}
            </div>

            <div class="flex flex-col text-left">
              <span class="text-[14px] font-extrabold leading-none text-white tracking-tight">{{ userName }}</span>
              <span class="text-[9px] font-black text-k-text-dim mt-1 uppercase tracking-widest">{{ userRole }}</span>
            </div>

            <span class="material-symbols-rounded text-white/20 transition-transform duration-300" [class.rotate-180]="menuOpen()">
              expand_more
            </span>
          </button>

          <!-- DROPDOWN -->
          @if (menuOpen()) {
            <div 
              class="absolute top-[70px] right-0 w-[240px] bg-[#0A0A0A] border border-white/10 rounded-[24px] p-3 shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[100] animate-fade"
            >
              <div class="p-4 mb-2 border-b border-white/5">
                <p class="text-[10px] font-black text-k-text-dim uppercase tracking-[2px]">Account</p>
                <p class="text-xs font-bold text-white mt-1">{{ userName }}</p>
              </div>

              <button 
                class="w-full h-14 flex items-center gap-4 px-4 rounded-2xl transition-all duration-300 hover:bg-k-red/10 group" 
                (click)="logout.emit()">
                <div class="w-10 h-10 rounded-xl bg-k-red/10 flex items-center justify-center text-k-red group-hover:bg-k-red group-hover:text-white transition-all">
                  <span class="material-symbols-rounded text-[20px]">logout</span>
                </div>
                <span class="text-sm font-bold text-white/60 group-hover:text-white">Cerrar Sesión</span>
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    @keyframes fade {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade { animation: fade 0.3s cubic-bezier(0.23, 1, 0.32, 1); }
  `]
})
export class KHeaderComponent {
  @Input() title: string = '';
  @Input() userName: string = 'Usuario';
  @Input() userRole: string = 'Staff';
  @Output() logout = new EventEmitter<void>();

  menuOpen = signal(false);
}
