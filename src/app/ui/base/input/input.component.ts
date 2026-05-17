import { Component, Input, Output, EventEmitter } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'k-input',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  template: `
    <div class="flex flex-col gap-2 w-full group">
      @if (label) {
        <label
          class="text-[10px] font-black tracking-[0.2em] uppercase text-k-text-muted ml-4 transition-colors group-focus-within:text-k-red"
        >
          {{ label }}
        </label>
      }

      <div
        [class]="
          'relative flex items-center bg-black/40 border rounded-[20px] transition-all duration-300 backdrop-blur-md ' +
          (error
            ? 'border-k-red/50'
            : 'border-white/5 focus-within:border-k-red/30 focus-within:bg-black/60')
        "
      >
        @if (icon) {
          <mat-icon
            class="ml-6 text-k-red/80 transition-colors group-focus-within:text-k-red !w-[20px] !h-[20px] !text-[20px]"
          >
            {{ icon }}
          </mat-icon>
        }

        <input
          [type]="type"
          [placeholder]="placeholder"
          [value]="value"
          (input)="onInput($event)"
          class="w-full bg-transparent border-none py-5 px-6 text-[15px] tracking-wider text-white placeholder:text-white/10 outline-none"
        />

        <ng-content select="[suffix]"></ng-content>
      </div>

      @if (error) {
        <span class="text-[10px] font-black text-k-red ml-4 uppercase tracking-widest">{{
          error
        }}</span>
      }
    </div>
  `,
})
export class KInputComponent<T> {
  @Input() label?: string;
  @Input() placeholder: string = '';
  @Input() icon?: string;
  @Input() type: string = 'text';
  @Input() value?: T;
  @Input() error?: string;

  @Output() valueChange = new EventEmitter<T>();

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val: string | number | null = input.value;
    if (this.type === 'number') {
      const num = parseFloat(input.value);
      val = isNaN(num) ? null : num;
    }
    this.value = val as unknown as T;
    this.valueChange.emit(this.value);
  }
}
