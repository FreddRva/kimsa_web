import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';
import { User } from '../../../../core/domain/staff/staff.model';

@Component({
  selector: 'k-employee-admin-item',
  standalone: true,
  imports: [KButtonComponent, KBadgeComponent],
  template: `
    <div class="bg-white/[0.01] border border-white/[0.03] rounded-[24px] p-5 px-8 flex items-center justify-between group hover:bg-white/[0.03] transition-all">
      <div class="flex items-center gap-6">
        <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-k-green transition-colors overflow-hidden">
          @if (!employee.photoUrl) {
            <span class="material-symbols-rounded text-2xl">person</span>
          } @else {
            <img [src]="employee.photoUrl" class="w-full h-full object-cover">
          }
        </div>
        <div class="flex flex-col">
          <strong class="text-sm font-black tracking-tight uppercase">{{ employee.name }}</strong>
          <span class="text-[9px] font-black opacity-20 uppercase tracking-widest">{{ employee.email }}</span>
        </div>
      </div>

      <div class="flex items-center gap-10">
        <div class="hidden md:flex flex-col items-end">
          <span class="text-[9px] font-black opacity-20 uppercase tracking-widest">Cargo / Rol</span>
          <k-badge [variant]="getRoleVariant(employee.role)" [dot]="true" customClass="uppercase">
            {{ employee.role }}
          </k-badge>
        </div>
        
        <div class="flex gap-2.5">
          <k-button variant="glass" customClass="!p-2 w-10 h-10" (kClick)="onEdit.emit(employee)">
            <span class="material-symbols-rounded text-lg">edit</span>
          </k-button>
          <k-button variant="danger" customClass="!p-2 w-10 h-10" (kClick)="onDelete.emit(employee)">
            <span class="material-symbols-rounded text-lg">delete</span>
          </k-button>
        </div>
      </div>
    </div>
  `
})
export class EmployeeAdminItemComponent {
  @Input({ required: true }) employee!: User;
  @Output() onEdit = new EventEmitter<User>();
  @Output() onDelete = new EventEmitter<User>();

  getRoleVariant(role: string): 'danger' | 'success' | 'info' | 'warning' {
    const variants: { [key: string]: 'danger' | 'success' | 'info' | 'warning' } = {
      admin: 'danger',
      cashier: 'success',
      waiter: 'info',
      kitchen: 'warning'
    };
    return variants[role] || 'info';
  }
}
