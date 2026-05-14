import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KCardComponent } from '../../../../ui/card/card.component';
import { KButtonComponent } from '../../../../ui/button/button.component';
import { KBadgeComponent } from '../../../../ui/badge/badge.component';
import { Order } from '../../../../shared/models';

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [
    CommonModule,
    KCardComponent,
    KButtonComponent,
    KBadgeComponent
  ],
  templateUrl: './dashboard-view.component.html'
})
export class DashboardViewComponent {
  @Input() stats: any;
  @Input() paidOrders: Order[] = [];

  get weeklySales() {
    const days = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    const result = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayName = days[d.getDay()];
      const dayDate = d.toDateString();
      
      const dayTotal = this.paidOrders
        .filter(o => {
          const dateValue = o.paidAt || o.timestamp;
          if (!dateValue) return false;
          const od = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
          return od.toDateString() === dayDate;
        })
        .reduce((sum, o) => sum + (o.total || 0), 0);
        
      result.push({ day: dayName, total: dayTotal });
    }
    
    const max = Math.max(...result.map(r => r.total), 1);
    return result.map(r => ({ ...r, height: (r.total / max) * 100 }));
  }

  get topProducts() {
    const today = new Date().toDateString();
    const todayOrders = this.paidOrders.filter(o => {
      const dateValue = o.paidAt || o.timestamp;
      if (!dateValue) return false;
      const od = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
      return od.toDateString() === today;
    });

    const productCounts: { [key: string]: { name: string, count: number, total: number } } = {};
    
    todayOrders.forEach(o => {
      o.items?.forEach((item: any) => {
        const name = item.name || item.productName;
        if (!productCounts[name]) {
          productCounts[name] = { name, count: 0, total: 0 };
        }
        productCounts[name].count += item.quantity;
        productCounts[name].total += (item.price || item.unitPrice) * item.quantity;
      });
    });

    return Object.values(productCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  formatPrice(p: number) { return (p || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 }); }
  formatTime(paidAt: any) {
    if (!paidAt) return '00:00';
    const d = paidAt.toDate ? paidAt.toDate() : new Date(paidAt);
    return d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }
}
