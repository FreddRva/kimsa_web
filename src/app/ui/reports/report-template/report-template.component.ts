import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'k-report-template',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div id="ticket-print" class="text-black bg-white p-[20mm] font-sans">
      <!-- Encabezado -->
      <div class="flex justify-between items-start mb-10 border-b-2 border-black pb-6">
        <div class="flex items-center gap-6">
          <div
            class="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white font-black text-2xl"
          >
            K
          </div>
          <div>
            <h1 class="text-xl font-black tracking-tight uppercase">{{ title }}</h1>
            <p class="text-xs font-bold uppercase opacity-60">RESTAURANTE KIMSA RESTOBAR</p>
            <p class="text-[10px] opacity-40">PROL. LIBERTAD N° 965-969 • RUC: 20123456789</p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-[10px] font-black uppercase tracking-widest">
            Fecha: {{ today | date: 'dd/MM/yyyy' }}
          </p>
          <p class="text-[10px] font-black uppercase tracking-widest">
            Hora: {{ today | date: 'HH:mm:ss' }}
          </p>
        </div>
      </div>

      <ng-content></ng-content>

      <div class="text-center mt-20 opacity-20">
        <p class="text-[8px] font-black uppercase tracking-[5px]">
          *** REPORTE GENERADO PARA GERENCIA - KIMSA ***
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        visibility: hidden;
        position: fixed;
        left: -9999px;
        top: 0;
      }
      @media print {
        :host {
          display: block;
          visibility: visible;
          position: absolute;
          left: 0;
          top: 0;
        }
        #ticket-print {
          width: 210mm;
          min-height: 297mm;
          color: black !important;
          background: white !important;
        }
      }
    `,
  ],
})
export class KReportTemplateComponent {
  @Input() title: string = 'Reporte de Ventas';
  today = new Date();
}
