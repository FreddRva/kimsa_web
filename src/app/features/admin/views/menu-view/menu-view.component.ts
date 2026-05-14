import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ProductRepository } from '../../../../data/repositories/product.repository';
import { KCardComponent } from '../../../../ui/card/card.component';
import { KButtonComponent } from '../../../../ui/button/button.component';
import { KBadgeComponent } from '../../../../ui/badge/badge.component';
import { CurrencyPePipe } from '../../../../shared/pipes/currency-pe.pipe';
import { Product, Category } from '../../../../shared/models';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { ConfirmDialogComponent } from '../../../../ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-menu-view',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    KCardComponent,
    KButtonComponent,
    KBadgeComponent,
    CurrencyPePipe,
  ],
  templateUrl: './menu-view.component.html'
})
export class MenuViewComponent {
  @Input() filteredProducts: Product[] = [];
  @Input() categories: Category[] = [];

  private dialog = inject(MatDialog);
  private productRepo = inject(ProductRepository);

  openProductDialog(product?: Product) {
    this.dialog.open(ProductDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      data: {
        product: product,
        categories: this.categories,
      },
      panelClass: 'bg-transparent'
    });
  }

  deleteProduct(id: string, name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'bg-transparent',
      data: {
        title: 'Eliminar Producto',
        message: `¿Estás seguro de que deseas eliminar el producto "${name}"? Esta acción no se puede deshacer.`,
        confirmText: 'Sí, Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productRepo.deleteProduct(id);
      }
    });
  }
}
