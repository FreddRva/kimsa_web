import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';
import { RestaurantTable } from '../../../../core/domain/table/table.model';

@Component({
  selector: 'k-table-admin-item',
  standalone: true,
  imports: [KButtonComponent, KBadgeComponent],
  template: `
    <div class="bg-white/[0.01] border border-white/[0.03] rounded-[24px] p-5 px-7.5 flex items-center gap-5 hover:bg-white/[0.03] transition-all group">
      <div class="flex-[2] flex flex-col">
        <strong class="text-base font-black tracking-wide group-hover:text-k-green transition-colors uppercase">MESA {{ table.number }}</strong>
        <span class="text-[9px] opacity-20 font-black">ID: #{{ table.id.slice(0,6).toUpperCase() }}</span>
      </div>
      
      <div class="flex-[3] text-[10px] font-black opacity-30 uppercase tracking-[2px] flex items-center gap-3">
        <span class="material-symbols-rounded text-base opacity-40">groups</span>
        {{ table.capacity || 4 }} PERSONAS
      </div>

      <div class="flex-[3]">
        <k-badge [variant]="table.status === 'occupied' ? 'danger' : 'success'" [dot]="true">
          {{ table.status === 'occupied' ? 'OCUPADA' : 'DISPONIBLE' }}
        </k-badge>
      </div>

      <div class="flex gap-2.5 ml-auto">
        <k-button variant="glass-interactive" customClass="!p-2 w-10 h-10" (kClick)="onEdit.emit(table)">
          <span class="material-symbols-rounded text-lg">edit</span>
        </k-button>
        <k-button variant="danger" customClass="!p-2 w-10 h-10" (kClick)="onDelete.emit(table)">
          <span class="material-symbols-rounded text-lg">delete</span>
        </k-button>
      </div>
    </div>
  `
})
export class TableAdminItemComponent {
  @Input({ required: true }) table!: RestaurantTable;
  @Output() onEdit = new EventEmitter<RestaurantTable>();
  @Output() onDelete = new EventEmitter<RestaurantTable>();
}
