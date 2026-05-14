import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductRepository } from '../../../../data/repositories/product.repository';
import { KCardComponent } from '../../../../ui/card/card.component';
import { KButtonComponent } from '../../../../ui/button/button.component';
import { KInputComponent } from '../../../../ui/input/input.component';

@Component({
  selector: 'app-station-distribution-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule, KCardComponent, KButtonComponent, KInputComponent],
  templateUrl: './station-distribution-view.component.html'
})
export class StationDistributionViewComponent {
  @Input() categories: any[] = [];
  @Input() products: any[] = [];

  private productRepo = inject(ProductRepository);
  isSaving = signal(false);
  hasChanges = signal(false);

  tempStations: { [key: string]: string } = {};
  tempComponents: { [key: string]: any[] } = {};
  expandedProduct = signal<string | null>(null);

  // Modal State
  showAddRouteModal = signal(false);
  newRouteName = '';
  newRouteTargetProductId = '';

  // Toast State
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  ngOnChanges() {
    this.loadCurrentData();
  }

  loadCurrentData() {
    this.tempStations = {};
    this.tempComponents = {};
    this.products.forEach(p => {
      this.tempStations[p.id] = p.station || '1';
      this.tempComponents[p.id] = p.components ? JSON.parse(JSON.stringify(p.components)) : [];
    });
    this.hasChanges.set(false);
  }

  toggleExpand(productId: string) {
    if (this.expandedProduct() === productId) {
      this.expandedProduct.set(null);
    } else {
      this.expandedProduct.set(productId);
    }
  }

  setStation(productId: string, station: string) {
    this.tempStations[productId] = station;
    this.hasChanges.set(true);
  }

  setComponentStation(productId: string, compIndex: number, station: string) {
    this.tempComponents[productId][compIndex].station = station;
    this.hasChanges.set(true);
  }

  addComponent(productId: string) {
    this.newRouteTargetProductId = productId;
    this.newRouteName = '';
    this.showAddRouteModal.set(true);
  }

  confirmAddRoute() {
    if (!this.newRouteName.trim()) return;
    
    this.tempComponents[this.newRouteTargetProductId].push({ 
      name: this.newRouteName.trim(), 
      station: '1' 
    });
    this.hasChanges.set(true);
    this.showAddRouteModal.set(false);
  }

  removeComponent(productId: string, compIndex: number) {
    this.tempComponents[productId].splice(compIndex, 1);
    this.hasChanges.set(true);
  }

  showToast(msg: string, type: 'success' | 'error' = 'success') {
    this.toastMessage.set(msg);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(''), 4000);
  }

  async saveChanges() {
    if (!this.hasChanges()) return;
    
    this.isSaving.set(true);
    try {
      const promises = this.products.map(p => {
        const newStation = this.tempStations[p.id];
        const newComponents = this.tempComponents[p.id];
        
        if (p.station !== newStation || JSON.stringify(p.components || []) !== JSON.stringify(newComponents)) {
          return this.productRepo.updateProduct(p.id, {
            station: newStation,
            components: newComponents
          });
        }
        return Promise.resolve();
      });
      
      await Promise.all(promises);
      this.hasChanges.set(false);
      this.showToast('Rutas de impresión actualizadas con éxito.', 'success');
    } catch (e: any) {
      console.error(e);
      this.showToast('Error guardando rutas. Intenta nuevamente.', 'error');
    } finally {
      this.isSaving.set(false);
    }
  }

  getProductsByCategory(catId: string) {
    return this.products.filter((p) => p.categoryId === catId && !p.isDeleted);
  }
}
