import { Component, Inject, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryFacade } from '../../../../core/application/facades/category.facade';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KInputComponent } from '../../../../ui/base/input/input.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';

import { Category } from '../../../../core/domain/category/category.model';

@Component({
  selector: 'app-dialogo-categoria',
  standalone: true,
  imports: [KButtonComponent, KInputComponent, KPageHeaderComponent, KBadgeComponent],
  templateUrl: './dialogo-categoria.component.html'
})
export class DialogoCategoriaComponent {
  private facade = inject(CategoryFacade);

  isEditing = false;
  catData = { id: '', name: '', iconName: 'restaurant' };
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    public dialogRef: MatDialogRef<DialogoCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category?: Category },
  ) {
    if (data.category) {
      this.isEditing = true;
      const cat = data.category;
      this.catData = {
        id: cat.id ?? '',
        name: cat.name ?? '',
        iconName: cat.iconName ?? 'restaurant'
      };
    }
  }

  async onSave() {
    if (!this.catData.name) { this.errorMessage.set('Ingresa un nombre para la categoría.'); return; }
    this.loading.set(true);
    try {
      if (this.isEditing) await this.facade.updateCategory(this.catData.id, this.catData);
      else await this.facade.addCategory(this.catData);
      this.dialogRef.close(true);
    } catch {
      this.errorMessage.set('Error al guardar.');
      this.loading.set(false);
    }
  }
}
