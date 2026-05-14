import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="p-8 bg-[#0d0d0d] text-white rounded-[32px] border border-white/5 shadow-2xl flex flex-col">
      <header class="flex items-center gap-4 mb-6">
        <div class="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
          <mat-icon class="text-2xl">warning</mat-icon>
        </div>
        <h2 class="text-xl font-black tracking-tight m-0 text-white">{{ data.title }}</h2>
      </header>
      
      <p class="text-[14px] text-white/70 font-bold mb-8 tracking-wide leading-relaxed">
        {{ data.message }}
      </p>

      <footer class="flex justify-end gap-3 mt-2">
        <button 
          (click)="dialogRef.close(false)" 
          class="px-6 py-3 bg-transparent border-none text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white cursor-pointer transition-colors">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button 
          (click)="dialogRef.close(true)"
          class="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl border-none text-[11px] font-black tracking-widest uppercase cursor-pointer transition-colors shadow-[0_5px_15px_rgba(239,68,68,0.2)]">
          {{ data.confirmText || 'Eliminar' }}
        </button>
      </footer>
    </div>
  `
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
