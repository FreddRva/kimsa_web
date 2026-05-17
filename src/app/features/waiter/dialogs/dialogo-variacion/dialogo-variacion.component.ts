import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../../../core/domain/product/product.model';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KCardComponent } from '../../../../ui/base/card/card.component';

@Component({
  selector: 'app-dialogo-variacion',
  standalone: true,
  imports: [DecimalPipe, KButtonComponent, KCardComponent],
  templateUrl: './dialogo-variacion.component.html'
})
export class DialogoVariacionComponent {
  private dialogRef = inject(MatDialogRef<DialogoVariacionComponent>);
  public data = inject<{ product: Product }>(MAT_DIALOG_DATA);

  selectVariation(variation: { name: string; price: number }) {
    this.dialogRef.close(variation);
  }

  onClose() {
    this.dialogRef.close();
  }
}
