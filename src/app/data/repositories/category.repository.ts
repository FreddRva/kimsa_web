import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '../../core/domain/category/category.model';
import { CategoryRepositoryPort } from '../../core/domain/category/category.repository.port';

@Injectable({ providedIn: 'root' })
export class CategoryRepository implements CategoryRepositoryPort {
  private firestore = inject(Firestore);

  getCategories(): Observable<Category[]> {
    const col = collection(this.firestore, 'categories');
    return collectionData(col, { idField: 'id' }) as Observable<Category[]>;
  }
  
  async addCategory(data: Partial<Category>): Promise<void> { 
    await addDoc(collection(this.firestore, 'categories'), data); 
  }
  
  async updateCategory(id: string, data: Partial<Category>): Promise<void> { 
    await updateDoc(doc(this.firestore, `categories/${id}`), data); 
  }
  
  async deleteCategory(id: string): Promise<void> { 
    await updateDoc(doc(this.firestore, `categories/${id}`), { isDeleted: true }); 
  }
}
