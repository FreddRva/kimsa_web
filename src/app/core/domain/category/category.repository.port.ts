import { Observable } from 'rxjs';
import { Category } from './category.model';

export interface CategoryRepositoryPort {
  getCategories(): Observable<Category[]>;
  addCategory(data: Partial<Category>): Promise<void>;
  updateCategory(id: string, data: Partial<Category>): Promise<void>;
  deleteCategory(id: string): Promise<void>;
}
