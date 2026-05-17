import { Observable } from 'rxjs';
import { Customer } from './customer.model';

export interface CustomerRepositoryPort {
  saveCustomer(id: string, data: Partial<Customer>): Promise<void>;
  getCustomers(): Observable<Customer[]>;
  consultDni(dni: string): Promise<{ name: string; birthday?: string }>;
}
