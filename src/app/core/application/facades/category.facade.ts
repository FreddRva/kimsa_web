import { Injectable, inject, signal } from '@angular/core';
import { CATEGORY_REPOSITORY_TOKEN } from '../../infrastructure/category.token';
import { Category } from '../../domain/category/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryFacade {
  private repository = inject(CATEGORY_REPOSITORY_TOKEN);

  // State
  categories = signal<Category[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    this.loadCategories();
  }

  private loadCategories() {
    this.loading.set(true);
    this.repository.getCategories().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.error.set('Error al cargar las categorías');
        this.loading.set(false);
      }
    });
  }

  async addCategory(data: Partial<Category>): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.repository.addCategory(data);
    } catch (err) {
      console.error('Error adding category', err);
      this.error.set('Error al crear la categoría');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.repository.updateCategory(id, data);
    } catch (err) {
      console.error('Error updating category', err);
      this.error.set('Error al actualizar la categoría');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.repository.deleteCategory(id);
    } catch (err) {
      console.error('Error deleting category', err);
      this.error.set('Error al eliminar la categoría');
      throw err;
    } finally {
      this.loading.set(false);
    }
  }
}
