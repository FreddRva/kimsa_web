import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Product } from '../../../../core/domain/product/product.model';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';

@Component({
  selector: 'app-dialogo-detalles-producto',
  standalone: true,
  imports: [DecimalPipe, MatDialogModule, KCardComponent, KButtonComponent],
  templateUrl: './dialogo-detalles-producto.component.html',
})
export class DialogoDetallesProductoComponent {
  private dialogRef = inject(MatDialogRef<DialogoDetallesProductoComponent>);
  public data = inject<{ product: Product }>(MAT_DIALOG_DATA);

  onAdd() {
    this.dialogRef.close({ action: 'add', product: this.data.product });
  }

  onAddVariation(variation: { name: string; price: number }) {
    const variationProduct: Product = {
      ...this.data.product,
      id: `${this.data.product.id}-${variation.name}`,
      name: `${this.data.product.name} (${variation.name.toUpperCase()})`,
      price: variation.price,
      variationName: variation.name,
    };
    this.dialogRef.close({ action: 'add', product: variationProduct });
  }

  onClose() {
    this.dialogRef.close();
  }
}
