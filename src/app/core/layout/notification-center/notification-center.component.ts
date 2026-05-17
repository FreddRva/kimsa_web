import { Component, inject, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'k-notification-center',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div class="fixed inset-0 z-[200] flex justify-end">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        (click)="close.emit()"
      ></div>

      <!-- Panel -->
      <div
        class="relative flex h-full w-full max-w-[340px] flex-col bg-[#111111] shadow-2xl transition-transform duration-300"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div class="flex items-center gap-3">
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/80"
            >
              <span class="material-symbols-rounded text-lg">notifications</span>
            </div>
            <h3 class="text-sm font-bold tracking-wide text-white">Notificaciones</h3>
          </div>

          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/5 hover:text-white"
            (click)="close.emit()"
          >
            <span class="material-symbols-rounded text-lg">close</span>
          </button>
        </div>

        <!-- Actions -->
        <div
          class="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/[0.02]"
        >
          <span class="text-xs font-semibold text-white/50"
            >{{ notifications().length }} Mensajes</span
          >
          <button
            class="text-xs font-bold text-k-green transition hover:text-green-400"
            (click)="markAllAsRead()"
          >
            Marcar todo como leído
          </button>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto no-scrollbar p-4">
          @if (notifications().length === 0) {
            <div class="flex h-40 flex-col items-center justify-center text-center">
              <span class="material-symbols-rounded mb-3 text-4xl text-white/10"
                >notifications_paused</span
              >
              <p class="text-sm font-bold text-white/30">No tienes notificaciones</p>
            </div>
          } @else {
            <div class="flex flex-col gap-3">
              @for (notif of notifications(); track notif.id) {
                <div
                  class="group relative flex gap-4 rounded-[16px] border border-white/[0.04] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
                  [class.opacity-60]="notif.read"
                >
                  <div
                    class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400"
                  >
                    <span class="material-symbols-rounded text-[20px]">info</span>
                  </div>
                  <div class="flex min-w-0 flex-1 flex-col">
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-sm font-bold text-white">{{ notif.title }}</p>
                      <span class="shrink-0 text-[10px] font-bold text-white/30">{{
                        notif.timestamp | date: 'shortTime'
                      }}</span>
                    </div>
                    <p class="mt-1 text-xs text-white/50 leading-relaxed">{{ notif.body }}</p>
                  </div>
                  @if (!notif.read) {
                    <div class="absolute right-4 top-4 h-2 w-2 rounded-full bg-blue-500"></div>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class NotificationCenterComponent {
  notificationService = inject(NotificationService);

  notifications = this.notificationService.notifications;

  @Output() close = new EventEmitter<void>();

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }
}
