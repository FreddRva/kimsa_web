import { Component, inject, signal, OnInit } from '@angular/core';
import { ProductFacade } from '../../../../core/application/facades/product.facade';
import { CategoryFacade } from '../../../../core/application/facades/category.facade';
import { StationFacade } from '../../../../core/application/facades/station.facade';
// ─── Imports de Componentes UI ────────────────────────────────────────────────
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { ProductStationItemComponent } from '../../components/product-station-item/product-station-item.component';

@Component({
  selector: 'vista-distribucion-estaciones',
  standalone: true,
  imports: [KButtonComponent, KPageHeaderComponent, ProductStationItemComponent],
  templateUrl: './vista-distribucion-estaciones.component.html',
})
export class VistaDistribucionEstacionesComponent implements OnInit {
  private categoryFacade = inject(CategoryFacade);
  private productFacade = inject(ProductFacade);
  public stationFacade = inject(StationFacade);
  categories = this.categoryFacade.categories;
  isSaving = signal(false);
  toastMessage = signal('');
  ngOnInit() {
    this.stationFacade.initialize();
  }
  getProductsByCategory(catId: string) {
    return this.productFacade.products().filter((p) => p.categoryId === catId && !p.isDeleted);
  }
  async saveChanges() {
    this.isSaving.set(true);
    try {
      await this.stationFacade.saveChanges();
      this.toastMessage.set('Cambios guardados correctamente');
      setTimeout(() => this.toastMessage.set(''), 3000);
    } finally {
      this.isSaving.set(false);
    }
  }
}
