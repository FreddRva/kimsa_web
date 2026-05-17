import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc, setDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../core/domain/staff/staff.model';
import { StaffRepositoryPort } from '../../core/domain/staff/staff.repository.port';

@Injectable({ providedIn: 'root' })
export class StaffRepository implements StaffRepositoryPort {
  private firestore = inject(Firestore);

  getStaff(): Observable<User[]> { 
    return collectionData(collection(this.firestore, 'users'), { idField: 'id' }).pipe(
      map(users => users.filter(u => !(u as any)['isDeleted']) as User[])
    ); 
  }
  
  async deleteUser(id: string): Promise<void> { 
    await updateDoc(doc(this.firestore, `users/${id}`), { isDeleted: true }); 
  }
  
  async updateUser(id: string, data: Partial<User>): Promise<void> { 
    await updateDoc(doc(this.firestore, `users/${id}`), data); 
  }
  
  async addUserDoc(id: string, data: Partial<User>): Promise<void> { 
    await setDoc(doc(this.firestore, `users/${id}`), data); 
  }

  async getStaffByEmail(email: string): Promise<User[]> {
    const snapshot = await getDocs(collection(this.firestore, 'users'));
    const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any }) as User);
    const targetEmail = email.toLowerCase().trim();
    return allUsers.filter(u => (u.email || '').toLowerCase().trim() === targetEmail);
  }
}

