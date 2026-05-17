import { Component, Input, Output, EventEmitter } from '@angular/core';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { Category } from '../../../../core/domain/category/category.model';

@Component({
  selector: 'k-category-admin-item',
  standalone: true,
  imports: [KButtonComponent],
  template: `
    <div class="bg-white/[0.01] border border-white/[0.03] rounded-[24px] p-5 px-8 flex items-center justify-between group hover:bg-white/[0.03] transition-all">
      <div class="flex items-center gap-6">
        <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-k-green transition-colors">
          <span class="material-symbols-rounded text-2xl">folder_open</span>
        </div>
        <div class="flex flex-col">
          <strong class="text-sm font-black tracking-tight uppercase">{{ category.name }}</strong>
          <span class="text-[9px] font-black opacity-20 uppercase tracking-widest">ID: #{{ category.id.slice(-6).toUpperCase() }}</span>
        </div>
      </div>

      <div class="flex gap-2.5">
        <k-button variant="glass" customClass="!p-2 w-10 h-10" (kClick)="onEdit.emit(category)">
          <span class="material-symbols-rounded text-lg">edit</span>
        </k-button>
        <k-button variant="danger" customClass="!p-2 w-10 h-10" (kClick)="onDelete.emit(category)">
          <span class="material-symbols-rounded text-lg">delete</span>
        </k-button>
      </div>
    </div>
  `
})
export class CategoryAdminItemComponent {
  @Input({ required: true }) category!: Category;
  @Output() onEdit = new EventEmitter<Category>();
  @Output() onDelete = new EventEmitter<Category>();
}
