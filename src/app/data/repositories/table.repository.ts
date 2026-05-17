import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { RestaurantTable, TableStatus } from '../../core/domain/table/table.model';
import { TableRepositoryPort } from '../../core/domain/table/table.repository.port';

@Injectable({ providedIn: 'root' })
export class TableRepository implements TableRepositoryPort {
  private firestore = inject(Firestore);

  getTables(): Observable<RestaurantTable[]> {
    const col = collection(this.firestore, 'tables');
    return collectionData(col, { idField: 'id' }) as Observable<RestaurantTable[]>;
  }
  
  async addTable(data: Partial<RestaurantTable>): Promise<unknown> { 
    return addDoc(collection(this.firestore, 'tables'), data); 
  }
  
  async updateTable(id: string, data: Partial<RestaurantTable>): Promise<void> { 
    await updateDoc(doc(this.firestore, `tables/${id}`), data); 
  }
  
  async deleteTable(id: string): Promise<void> { 
    await updateDoc(doc(this.firestore, `tables/${id}`), { isDeleted: true }); 
  }
  
  async updateTableStatus(tableId: string, status: TableStatus, orderId: string | null = null): Promise<void> {
    await updateDoc(doc(this.firestore, `tables/${tableId}`), { status, currentOrderId: orderId });
  }
}
