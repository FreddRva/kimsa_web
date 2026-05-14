import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TableRepository {
  private firestore = inject(Firestore);

  getTables(): Observable<any[]> {
    const col = collection(this.firestore, 'tables');
    return collectionData(col, { idField: 'id' });
  }
  
  addTable(data: any) { 
    return addDoc(collection(this.firestore, 'tables'), data); 
  }
  
  updateTable(id: string, data: any) { 
    return updateDoc(doc(this.firestore, `tables/${id}`), data); 
  }
  
  deleteTable(id: string) { 
    return updateDoc(doc(this.firestore, `tables/${id}`), { isDeleted: true }); 
  }
  
  updateTableStatus(tableId: string, status: string, orderId: string | null = null) {
    return updateDoc(doc(this.firestore, `tables/${tableId}`), { status, currentOrderId: orderId });
  }
}
