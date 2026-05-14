import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { serverTimestamp } from '@angular/fire/firestore';
import { AuthService } from '../../core/services/auth.service';
import { Product, Category } from '../../shared/models';
import { RestaurantTable } from '../../shared/models/table.interface';
import { CategoryRepository } from '../../data/repositories/category.repository';
import { ProductRepository } from '../../data/repositories/product.repository';
import { TableRepository } from '../../data/repositories/table.repository';
import { OrderRepository } from '../../data/repositories/order.repository';
import { CartStore } from '../../store/cart.store';
import { WaiterSidebarComponent } from './components/waiter-sidebar/waiter-sidebar.component';
import { WaiterTopBarComponent } from './components/waiter-top-bar/waiter-top-bar.component';
import { TablesViewComponent } from './components/tables-view/tables-view.component';
import { MenuViewComponent } from './components/menu-view/menu-view.component';
import { SummaryViewComponent } from './components/summary-view/summary-view.component';

@Component({
  selector: 'app-waiter',
  standalone: true,
  imports: [
    CommonModule,
    WaiterSidebarComponent,
    WaiterTopBarComponent,
    TablesViewComponent,
    MenuViewComponent,
    SummaryViewComponent,
  ],
  templateUrl: './waiter.component.html',
  styleUrl: './waiter.component.css',
})
export class WaiterComponent {
  private categoryRepo = inject(CategoryRepository) as CategoryRepository;
  private productRepo = inject(ProductRepository) as ProductRepository;
  private tableRepo = inject(TableRepository) as TableRepository;
  private orderRepo = inject(OrderRepository) as OrderRepository;
  public cartStore = inject(CartStore) as CartStore;
  private authService = inject(AuthService) as AuthService;
  public auth = inject(Auth);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  selectedCategory = signal('');
  isPopular = signal(true);
  searchQuery = signal('');
  customerName = signal<string | null>(null);

  currentOrder = this.cartStore.items;
  orderTotal = this.cartStore.total;
  loading = signal(true);

  toastMessage = signal<string | null>(null);
  showTableModal = signal(false);
  showVariationModal = signal(false);
  showDetailsModal = signal(false);

  selectedProductForVariation = signal<Product | null>(null);
  selectedProduct = signal<Product | null>(null);
  tables = signal<RestaurantTable[]>([]);
  selectedTable = signal<RestaurantTable | null>(null);
  isDelivery = signal(false);
  clockLabel = signal('');

  constructor() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.loadData();
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(null), 2800);
  }

  updateClock() {
    const now = new Date();
    const datePart = now.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const timePart = now.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    this.clockLabel.set(`${datePart}. ${timePart}`.toUpperCase());
  }

  mozoDisplayName(): string {
    return this.authService.currentUserData()?.name || this.auth.currentUser?.displayName || 'Mozo';
  }

  loadData() {
    this.loading.set(true);
    this.categoryRepo.getCategories().subscribe((res: Category[]) => this.categories.set(res));
    this.productRepo.getProducts().subscribe((res: Product[]) => {
      this.products.set(res);
      this.recomputeFilteredProducts();
    });
    this.tableRepo.getTables().subscribe((res: RestaurantTable[]) => {
      this.tables.set(res);
      this.loading.set(false);
    });
  }

  recomputeFilteredProducts() {
    const q = this.searchQuery().trim().toLowerCase();
    const all = this.products().filter((p) => !p.isDeleted && p.isAvailable !== false);
    if (this.isPopular()) {
      let list = all.slice(0, 20);
      if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
      this.filteredProducts.set(list);
      return;
    }
    const cat = this.categories().find((c) => c.name === this.selectedCategory());
    let list = cat ? all.filter((p) => p.categoryId === cat.id) : [];
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q));
    this.filteredProducts.set(list);
  }

  onSearchFromBar(value: string) {
    this.searchQuery.set(value);
    this.recomputeFilteredProducts();
  }

  onSidebarCategory(name: string) {
    this.isPopular.set(false);
    this.selectedCategory.set(name);
    this.recomputeFilteredProducts();
  }

  onMesaChip() {
    if (this.selectedTable()) {
      this.selectedTable.set(null);
      return;
    }
    this.showTableModal.set(true);
  }

  onLlevarChip() {
    if (this.isDelivery()) {
      this.isDelivery.set(false);
      this.customerName.set(null);
      return;
    }
    if (!this.selectedTable()) {
      this.isDelivery.set(true);
    }
  }

  onPopularChip() {
    this.onSetPopular();
  }

  onToggleDelivery() {
    this.isDelivery.set(true);
    this.selectedTable.set(null);
    this.showTableModal.set(false);
  }

  selectTable(table: RestaurantTable) {
    this.selectedTable.set(table);
    this.isDelivery.set(false);
    this.showTableModal.set(false);
  }

  onAddItem(product: Product) {
    if (!this.selectedTable() && !this.isDelivery()) {
      this.showTableModal.set(true);
      return;
    }

    const variations = product.variations;
    if (variations && variations.length > 0 && !(product as any).variationName) {
      this.selectedProductForVariation.set(product);
      this.showVariationModal.set(true);
      return;
    }

    this.cartStore.addItem(product);
    this.showToast(`${product.name.toUpperCase()} AGREGADO`);
  }

  onShowDetails(product: Product) {
    this.selectedProduct.set(product);
    this.showDetailsModal.set(true);
  }

  onUpdateQty(event: { id: string; qty: number }) {
    if (event.qty <= 0) {
      this.cartStore.removeItem(event.id);
    } else {
      this.cartStore.updateQuantity(event.id, event.qty);
    }
  }

  onUpdateNotes(event: { id: string; notes: string }) {
    this.cartStore.updateNotes(event.id, event.notes);
  }

  onResetSummary() {
    this.selectedTable.set(null);
    this.isDelivery.set(false);
    this.customerName.set(null);
    this.cartStore.clearCart();
  }

  onAddVariation(variation: any) {
    const baseProduct = this.selectedProductForVariation();
    if (!baseProduct) return;
    const finalProduct = {
      ...baseProduct,
      id: `${baseProduct.id}-${variation.name}`,
      price: variation.price,
      name: `${baseProduct.name} (${variation.name.toUpperCase()})`,
      variationName: variation.name,
    };
    this.cartStore.addItem(finalProduct);
    this.showToast(`SE AGREGÓ: ${finalProduct.name.toUpperCase()}`);
    this.showVariationModal.set(false);
  }

  onSendToKitchen() {
    if (this.currentOrder().length === 0) return;
    const user = this.auth.currentUser;
    const table = this.selectedTable();

    const orderData = {
      items: this.currentOrder(),
      total: this.orderTotal(),
      tableId: this.isDelivery() ? 'delivery' : table?.id,
      tableNumber: this.isDelivery() ? 'DL' : table?.number,
      isDelivery: this.isDelivery(),
      waiterId: user?.uid || 'anonymous',
      waiterName: this.mozoDisplayName(),
      status: 'pending',
      timestamp: serverTimestamp(),
    };
    this.orderRepo.sendToKitchen(orderData).then(() => {
      if (!this.isDelivery() && table)
        this.tableRepo.updateTableStatus(table.id, 'occupied', 'new_order');
      this.cartStore.clearCart();
      this.selectedTable.set(null);
      this.isDelivery.set(false);
      this.customerName.set(null);
      this.showToast('PEDIDO ENVIADO CON ÉXITO');
    });
  }

  onSetPopular() {
    this.isPopular.set(true);
    this.selectedCategory.set('');
    this.recomputeFilteredProducts();
  }

  onLogout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
