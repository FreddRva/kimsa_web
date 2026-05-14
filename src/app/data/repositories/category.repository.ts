import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Category } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class CategoryRepository {
  private firestore = inject(Firestore);

  getCategories(): Observable<Category[]> {
    const col = collection(this.firestore, 'categories');
    return collectionData(col, { idField: 'id' }) as Observable<Category[]>;
  }
  
  addCategory(data: Partial<Category>) { 
    return addDoc(collection(this.firestore, 'categories'), data); 
  }
  
  updateCategory(id: string, data: Partial<Category>) { 
    return updateDoc(doc(this.firestore, `categories/${id}`), data); 
  }
  
  deleteCategory(id: string) { 
    return updateDoc(doc(this.firestore, `categories/${id}`), { isDeleted: true }); 
  }
}
