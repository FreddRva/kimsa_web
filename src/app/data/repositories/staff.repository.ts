import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StaffRepository {
  private firestore = inject(Firestore);

  getStaff(): Observable<any[]> { 
    return collectionData(collection(this.firestore, 'users'), { idField: 'id' }); 
  }
  
  deleteUser(id: string) { 
    return updateDoc(doc(this.firestore, `users/${id}`), { isDeleted: true }); 
  }
  
  updateUser(id: string, data: any) { 
    return updateDoc(doc(this.firestore, `users/${id}`), data); 
  }
  
  addUserDoc(id: string, data: any) { 
    return setDoc(doc(this.firestore, `users/${id}`), data); 
  }
}
