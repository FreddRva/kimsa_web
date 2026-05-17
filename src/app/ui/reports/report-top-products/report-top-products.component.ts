import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TopProductPerformance } from '../../../core/application/facades/dashboard.facade';

@Component({
  selector: 'k-report-top-products',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    @if (products && products.length > 0) {
      <div class="mb-10 animate-fade">
        <h3 class="text-xs font-black uppercase tracking-[3px] mb-4">Rendimiento de Productos</h3>
        <table class="w-full">
          <thead>
            <tr>
              <th class="text-left py-2 border-b-2 border-black/5 text-[10px] font-black uppercase">Pos</th>
              <th class="text-left py-2 border-b-2 border-black/5 text-[10px] font-black uppercase">Producto / Item</th>
              <th class="text-right py-2 border-b-2 border-black/5 text-[10px] font-black uppercase">Venta Total</th>
            </tr>
          </thead>
          <tbody>
            @for (p of products; track p.name; let i = $index) {
              <tr>
                <td class="py-2 border-b border-black/5 font-black text-[10px]">#{{ i + 1 }}</td>
                <td class="py-2 border-b border-black/5 font-bold uppercase text-[10px]">{{ p.name }}</td>
                <td class="py-2 border-b border-black/5 text-right font-black italic text-[10px]">S/ {{ p.total | number:'1.2-2' }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `
})
export class KReportTopProductsComponent {
  @Input({ required: true }) products: TopProductPerformance[] = [];
}
