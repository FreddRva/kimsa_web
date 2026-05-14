export type UserRole = 'admin' | 'waiter' | 'cashier' | 'chef';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  photoUrl?: string;
  phone?: string;
}
