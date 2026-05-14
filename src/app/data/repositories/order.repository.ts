import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, where, doc, updateDoc, serverTimestamp, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Order } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class OrderRepository {
  private firestore = inject(Firestore);

  getActiveOrders(): Observable<Order[]> {
    const col = collection(this.firestore, 'orders');
    const q = query(col, where('status', 'in', ['pending', 'ready', 'delivered', 'waiting_payment']));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }
  
  getPaidOrders(): Observable<Order[]> {
    const col = collection(this.firestore, 'orders');
    const q = query(col, where('status', '==', 'paid'));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  getCancelledOrders(): Observable<Order[]> {
    const col = collection(this.firestore, 'orders');
    const q = query(col, where('status', '==', 'cancelled'));
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }

  confirmPayment(orderId: string, method: string, tableId?: string, docType: string = 'Ticket', docNumber: string = '') {
    const orderDoc = doc(this.firestore, `orders/${orderId}`);
    const promise = updateDoc(orderDoc, { 
      status: 'paid', 
      paymentMethod: method, 
      documentType: docType,
      customerDocument: docNumber,
      paidAt: serverTimestamp() 
    });
    
    if (tableId && tableId !== 'delivery') {
      const tableDoc = doc(this.firestore, `tables/${tableId}`);
      return Promise.all([promise, updateDoc(tableDoc, { status: 'available', currentOrderId: null })]);
    }
    return promise;
  }

  cancelOrder(orderId: string, tableId?: string) {
    const orderDoc = doc(this.firestore, `orders/${orderId}`);
    const promise = updateDoc(orderDoc, { status: 'cancelled' });
    
    if (tableId && tableId !== 'delivery') {
      const tableDoc = doc(this.firestore, `tables/${tableId}`);
      return Promise.all([promise, updateDoc(tableDoc, { status: 'available', currentOrderId: null })]);
    }
    return promise;
  }

  sendToKitchen(orderData: any) { 
    return addDoc(collection(this.firestore, 'orders'), orderData); 
  }
}
