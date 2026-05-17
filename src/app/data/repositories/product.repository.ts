import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../../core/domain/product/product.model';
import { ProductRepositoryPort } from '../../core/domain/product/product.repository.port';

@Injectable({ providedIn: 'root' })
export class ProductRepository implements ProductRepositoryPort {
  private firestore = inject(Firestore);

  getProducts(): Observable<Product[]> {
    const col = collection(this.firestore, 'products');
    return collectionData(col, { idField: 'id' }) as Observable<Product[]>;
  }
  
  async addProduct(data: Partial<Product>): Promise<void> { 
    await addDoc(collection(this.firestore, 'products'), data); 
  }
  
  async updateProduct(id: string, data: Partial<Product>): Promise<void> { 
    await updateDoc(doc(this.firestore, `products/${id}`), data); 
  }
  
  async deleteProduct(id: string): Promise<void> { 
    await updateDoc(doc(this.firestore, `products/${id}`), { isDeleted: true }); 
  }
  
  async updateProductStation(id: string, station: string): Promise<void> { 
    await updateDoc(doc(this.firestore, `products/${id}`), { station }); 
  }
}
