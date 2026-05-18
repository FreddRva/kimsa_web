export type UserRole = 'admin' | 'waiter' | 'cashier' | 'chef';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isDeleted?: boolean;
  photoUrl?: string;
  phone?: string;
}
