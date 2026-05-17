import { Observable } from 'rxjs';
import { User } from './staff.model';

export interface StaffRepositoryPort {
  getStaff(): Observable<User[]>;
  addUserDoc(id: string, data: Partial<User>): Promise<void>;
  updateUser(id: string, data: Partial<User>): Promise<void>;
  deleteUser(id: string): Promise<void>;
  getStaffByEmail(email: string): Promise<User[]>;
}
