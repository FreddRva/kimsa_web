import { Component, Input, Output, EventEmitter, signal, OnDestroy } from '@angular/core';

@Component({
  selector: 'k-hold-button',
  standalone: true,
  template: `
    <div
      class="relative h-16 rounded-2xl overflow-hidden cursor-pointer select-none touch-none bg-white/5 border border-white/5 group active:scale-95 transition-transform duration-200"
      (mousedown)="startPress($event)"
      (mouseup)="stopPress()"
      (mouseleave)="stopPress()"
      (touchstart)="startPress($event)"
      (touchend)="stopPress()"
      (touchcancel)="stopPress()"
    >
      <!-- Progress Fill Layer -->
      <div
        class="absolute inset-y-0 left-0 bg-k-green/30 transition-all duration-75"
        [style.width.%]="progress() * 100"
      ></div>

      <!-- Shine effect on progress -->
      <div
        class="absolute inset-y-0 left-0 w-8 bg-white/20 blur-md -skew-x-12 animate-pulse"
        [style.left.%]="progress() * 100 - 5"
        [class.hidden]="!isPressing()"
      ></div>

      <!-- Content -->
      <div class="absolute inset-0 flex items-center justify-center gap-3">
        @if (isPressing()) {
          <span class="material-symbols-rounded animate-bounce text-k-green">touch_app</span>
          <span class="text-[11px] font-black uppercase tracking-[4px] text-k-green animate-pulse"
            >Confirmando...</span
          >
        } @else {
          <ng-content></ng-content>
        }
      </div>

      <!-- Border Glow when active -->
      <div
        class="absolute inset-0 border-2 border-k-green transition-opacity duration-300 pointer-events-none"
        [style.opacity]="progress()"
      ></div>
    </div>
  `,
})
export class KHoldButtonComponent implements OnDestroy {
  @Input() duration = 1500;
  @Output() kComplete = new EventEmitter<void>();

  isPressing = signal(false);
  progress = signal(0);

  private interval: number | null = null;
  private startTime = 0;

  ngOnDestroy() {
    this.stopPress();
  }

  startPress(event: MouseEvent | TouchEvent) {
    event.preventDefault();
    this.isPressing.set(true);
    this.progress.set(0);
    this.startTime = Date.now();

    this.interval = window.setInterval(() => {
      if (!this.isPressing()) {
        this.stopPress();
        return;
      }

      const p = Math.min((Date.now() - this.startTime) / this.duration, 1.0);
      this.progress.set(p);

      if (p >= 1.0) {
        this.stopPress();
        this.kComplete.emit();
      }
    }, 50);
  }

  stopPress() {
    this.isPressing.set(false);
    this.progress.set(0);
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
