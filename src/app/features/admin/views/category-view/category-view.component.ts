import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CategoryRepository } from '../../../../data/repositories/category.repository';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { KCardComponent } from '../../../../ui/card/card.component';
import { KButtonComponent } from '../../../../ui/button/button.component';
import { Category } from '../../../../shared/models';
import { ConfirmDialogComponent } from '../../../../ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-view',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatIconModule,
    KCardComponent,
    KButtonComponent
  ],
  templateUrl: './category-view.component.html'
})
export class CategoryViewComponent {
  @Input() categories: Category[] = [];

  private dialog = inject(MatDialog);
  private categoryRepo = inject(CategoryRepository);

  openCategoryDialog(category?: Category) {
    this.dialog.open(CategoryDialogComponent, {
      width: '400px',
      data: { category },
      panelClass: 'bg-transparent'
    });
  }

  deleteCategory(id: string, name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'bg-transparent',
      data: {
        title: 'Eliminar Categoría',
        message: `¿Estás seguro de que deseas eliminar la categoría "${name}"? Esta acción no se puede deshacer.`,
        confirmText: 'Sí, Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryRepo.deleteCategory(id);
      }
    });
  }
}
