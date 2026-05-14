import { Injectable, inject, signal, computed } from '@angular/core';
import { ProductRepository } from '../data/repositories/product.repository';
import { CategoryRepository } from '../data/repositories/category.repository';
import { TableRepository } from '../data/repositories/table.repository';
import { OrderRepository } from '../data/repositories/order.repository';
import { StaffRepository } from '../data/repositories/staff.repository';
import { Product, Category, Order } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class AdminStore {
  private productRepo = inject(ProductRepository);
  private categoryRepo = inject(CategoryRepository);
  private tableRepo = inject(TableRepository);
  private orderRepo = inject(OrderRepository);
  private staffRepo = inject(StaffRepository);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  tables = signal<any[]>([]);
  paidOrders = signal<Order[]>([]);
  users = signal<any[]>([]);

  constructor() {
    this.productRepo.getProducts().subscribe((data) => this.products.set(data));
    this.categoryRepo.getCategories().subscribe((data) => this.categories.set(data));
    this.tableRepo.getTables().subscribe((data) => this.tables.set(data));
    this.orderRepo.getPaidOrders().subscribe((data) => this.paidOrders.set(data));
    this.staffRepo.getStaff().subscribe((data) => this.users.set(data));
  }
}
