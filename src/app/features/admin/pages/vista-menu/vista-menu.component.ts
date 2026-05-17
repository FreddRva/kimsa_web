import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductFacade } from '../../../../core/application/facades/product.facade';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { ProductAdminItemComponent } from '../../components/product-admin-item/product-admin-item.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { DialogoProductoComponent } from '../../dialogs/dialogo-producto/dialogo-producto.component';
import { ConfirmDialogComponent } from '../../../../ui/feedback/confirm-dialog/confirm-dialog.component';
import { Product } from '../../../../core/domain/product/product.model';

@Component({
  selector: 'vista-menu-admin',
  standalone: true,
  imports: [KCardComponent, KButtonComponent, KPageHeaderComponent, ProductAdminItemComponent],
  templateUrl: './vista-menu.component.html'
})
export class VistaMenuAdminComponent {
  private productFacade = inject(ProductFacade);
  private dialog = inject(MatDialog);

  filteredProducts = this.productFacade.filteredProducts;

  openProductDialog(product?: Product) {
    this.dialog.open(DialogoProductoComponent, { width: '600px', data: { product }, panelClass: 'bg-transparent' });
  }

  deleteProduct(id: string, name: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px', panelClass: 'bg-transparent',
      data: { title: 'Eliminar Producto', message: `¿Eliminar ${name}?`, confirmText: 'Sí, Eliminar' }
    });
    ref.afterClosed().subscribe(result => { if (result) this.productFacade.deleteProduct(id); });
  }
}
