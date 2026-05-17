import { InjectionToken } from '@angular/core';
import { CustomerRepositoryPort } from '../domain/customer/customer.repository.port';

export const CUSTOMER_REPOSITORY_TOKEN = new InjectionToken<CustomerRepositoryPort>('CustomerRepositoryPort');
