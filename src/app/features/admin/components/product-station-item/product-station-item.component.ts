import { Component, Input, inject } from '@angular/core';
import { StationFacade } from '../../../../core/application/facades/station.facade';
import { KSelectComponent } from '../../../../ui/base/select/select.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';

import { Product } from '../../../../core/domain/product/product.model';

@Component({
  selector: 'k-product-station-item',
  standalone: true,
  imports: [KSelectComponent, KButtonComponent, KBadgeComponent],
  templateUrl: './product-station-item.component.html'
})
export class ProductStationItemComponent {
  @Input({ required: true }) product!: Product;
  public stationFacade = inject(StationFacade);
  isExpanded = false;

  onAddRoute() {
    const name = prompt('Nombre de la ruta/componente:');
    if (name) this.stationFacade.addComponent(this.product.id, name);
  }
}
