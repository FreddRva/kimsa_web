import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CategoryRepository } from '../../../../data/repositories/category.repository';
import { KButtonComponent } from '../../../../ui/button/button.component';
import { KInputComponent } from '../../../../ui/input/input.component';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    KButtonComponent,
    KInputComponent
  ],
  templateUrl: '../category-dialog/category-dialog.component.html',
  styleUrl: '../category-dialog/category-dialog.component.css'
})
export class CategoryDialogComponent {
  private categoryRepo = inject(CategoryRepository);

  isEditing = false;

  catData = {
    id: '',
    name: '',
    iconName: 'restaurant',
  };

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category?: any },
  ) {
    if (data.category) {
      this.isEditing = true;
      this.catData = { ...data.category };
    }
  }

  onSave() {
    if (!this.catData.name) {
      this.errorMessage.set('Por favor ingresa un nombre.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const savePromise = this.isEditing
      ? this.categoryRepo.updateCategory(this.catData.id, this.catData)
      : this.categoryRepo.addCategory(this.catData);

    savePromise
      .then(() => {
        this.dialogRef.close(true);
      })
      .catch((err: any) => {
        console.error('Error saving category', err);
        this.errorMessage.set('Error al guardar en base de datos.');
        this.loading.set(false);
      });
  }
}
