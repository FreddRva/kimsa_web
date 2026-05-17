import { Provider } from '@angular/core';
import { CATEGORY_REPOSITORY_TOKEN } from './category.token';
import { CategoryRepository } from '../../data/repositories/category.repository';
import { PRODUCT_REPOSITORY_TOKEN } from './product.token';
import { ProductRepository } from '../../data/repositories/product.repository';
import { ORDER_REPOSITORY_TOKEN } from './order.token';
import { OrderRepository } from '../../data/repositories/order.repository';
import { TABLE_REPOSITORY_TOKEN } from './table.token';
import { TableRepository } from '../../data/repositories/table.repository';
import { STAFF_REPOSITORY_TOKEN } from './staff.token';
import { StaffRepository } from '../../data/repositories/staff.repository';
import { CUSTOMER_REPOSITORY_TOKEN } from './customer.token';
import { CustomerRepository } from '../../data/repositories/customer.repository';

export const repositoryProviders: Provider[] = [
  { provide: CATEGORY_REPOSITORY_TOKEN, useClass: CategoryRepository },
  { provide: PRODUCT_REPOSITORY_TOKEN, useClass: ProductRepository },
  { provide: ORDER_REPOSITORY_TOKEN, useClass: OrderRepository },
  { provide: TABLE_REPOSITORY_TOKEN, useClass: TableRepository },
  { provide: STAFF_REPOSITORY_TOKEN, useClass: StaffRepository },
  { provide: CUSTOMER_REPOSITORY_TOKEN, useClass: CustomerRepository }
];
