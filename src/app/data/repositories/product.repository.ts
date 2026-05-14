import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class ProductRepository {
  private firestore = inject(Firestore);

  getProducts(): Observable<Product[]> {
    const col = collection(this.firestore, 'products');
    return collectionData(col, { idField: 'id' }) as Observable<Product[]>;
  }
  
  addProduct(data: Partial<Product>) { 
    return addDoc(collection(this.firestore, 'products'), data); 
  }
  
  updateProduct(id: string, data: Partial<Product>) { 
    return updateDoc(doc(this.firestore, `products/${id}`), data); 
  }
  
  deleteProduct(id: string) { 
    return updateDoc(doc(this.firestore, `products/${id}`), { isDeleted: true }); 
  }
  
  updateProductStation(id: string, station: string) { 
    return updateDoc(doc(this.firestore, `products/${id}`), { station }); 
  }
}
