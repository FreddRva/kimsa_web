import { Component, inject, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { Product } from '../../../../core/domain/product/product.model';
import { ProductFacade } from '../../../../core/application/facades/product.facade';
import { CartStore } from '../../store/cart.store';
import { ActiveOrderStore } from '../../store/active-order.store';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { TableFacade } from '../../../../core/application/facades/table.facade';
import { DialogoMesaComponent } from '../../dialogs/dialogo-mesa/dialogo-mesa.component';
import { DialogoVariacionComponent } from '../../dialogs/dialogo-variacion/dialogo-variacion.component';
import { DialogoDetallesProductoComponent } from '../../dialogs/dialogo-detalles-producto/dialogo-detalles-producto.component';

@Component({
  selector: 'vista-menu',
  standalone: true,
  imports: [MatDialogModule, DecimalPipe, KCardComponent, KButtonComponent],
  templateUrl: './vista-menu.component.html',
})
export class VistaMenuComponent {
  private dialog = inject(MatDialog);
  private cartStore = inject(CartStore);
  public order = inject(ActiveOrderStore);
  public productFacade = inject(ProductFacade);
  private tableFacade = inject(TableFacade);

  products = this.productFacade.filteredProducts;
  selectedCategory = this.productFacade.selectedCategory;
  isPopular = this.productFacade.isPopular;

  /**
   * Abre el diálogo de selección de mesa.
   * Retorna una promesa para poder encadenar acciones (como añadir al carrito tras elegir mesa).
   */
  async openTableSelection(): Promise<boolean> {
    const ref = this.dialog.open(DialogoMesaComponent, {
      width: '500px',
      panelClass: 'bg-transparent',
      backdropClass: 'backdrop-blur-sm',
    });

    const result = await firstValueFrom(ref.afterClosed());
    if (result) {
      if (result.type === 'table') this.order.setTable(result.data);
      else if (result.type === 'delivery') this.order.setDelivery();
      return true;
    }
    return false;
  }

  onMesaChip() {
    if (this.order.isDelivery()) {
      return; // No abrir selección de mesa si 'Para Llevar' está activo (debe cancelarse primero)
    }
    if (this.order.selectedTable()) {
      this.order.clearTable();
      return;
    }
    this.openTableSelection();
  }

  onLlevarChip() {
    if (this.order.isDelivery()) {
      this.order.clearDelivery();
      return;
    }
    this.order.setDelivery();
  }
  async onAddItem(product: Product) {
    // Regla de Oro: Si no hay mesa/llevar, obligamos a elegir una
    if (!this.order.hasDestination()) {
      const success = await this.openTableSelection();
      if (!success) return; // Si cancela el diálogo, no añadimos nada
    }
    const vars = product.variations;
    if (vars && vars.length > 0 && !product.variationName) {
      const ref = this.dialog.open(DialogoVariacionComponent, {
        data: { product },
        width: '400px',
        panelClass: 'bg-transparent',
      });
      ref.afterClosed().subscribe((v) => {
        if (v) this.addVariationToCart(product, v);
      });
      return;
    }
    this.cartStore.addItem(product);
  }

  async addVariationToCart(base: Product, variation: { name: string; price: number }) {
    // También validamos destino en las variaciones directas
    if (!this.order.hasDestination()) {
      const success = await this.openTableSelection();
      if (!success) return;
    }

    const p: Product = {
      ...base,
      id: `${base.id}-${variation.name}`,
      price: variation.price,
      name: `${base.name} (${variation.name.toUpperCase()})`,
      variationName: variation.name,
    };
    this.cartStore.addItem(p);
  }

  onShowDetails(product: Product) {
    const ref = this.dialog.open(DialogoDetallesProductoComponent, {
      data: { product },
      width: '400px',
      panelClass: 'bg-transparent',
    });
    ref.afterClosed().subscribe((result) => {
      if (result?.action === 'add') this.onAddItem(result.product);
    });
  }

  mesaActive = computed(() => !!this.order.selectedTable());
  llevarActive = computed(() => this.order.isDelivery());
  
  isTableOccupied = computed(() => {
    const t = this.order.selectedTable();
    if (!t) return false;
    const dbTable = this.tableFacade.tables().find(x => x.id === t.id);
    return dbTable ? dbTable.status === 'occupied' : false;
  });

  mesaLabel = computed(() => {
    const t = this.order.selectedTable();
    return t ? `MESA ${t.number}` : 'ELEGIR MESA';
  });

  llevarLabel = computed(() => {
    const n = this.order.customerName();
    return this.order.isDelivery() && n ? n.toUpperCase() : 'PARA LLEVAR';
  });

  watermark = computed(() => {
    return this.isPopular() ? 'TOP VENTAS' : (this.selectedCategory() || 'MENÚ').toUpperCase();
  });
}
