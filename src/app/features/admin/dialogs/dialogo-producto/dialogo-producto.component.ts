import { Component, Inject, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductFacade } from '../../../../core/application/facades/product.facade';
import { CategoryFacade } from '../../../../core/application/facades/category.facade';
import { KInputComponent } from '../../../../ui/base/input/input.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';

import { Product } from '../../../../core/domain/product/product.model';

@Component({
  selector: 'app-dialogo-producto',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    KInputComponent,
    KButtonComponent,
    KPageHeaderComponent,
    KCardComponent,
    KBadgeComponent,
  ],
  templateUrl: './dialogo-producto.component.html',
})
export class DialogoProductoComponent {
  private productFacade = inject(ProductFacade);
  private categoryFacade = inject(CategoryFacade);

  isEditing = false;
  categories = this.categoryFacade.categories; // Usar Signal del Facade

  productData = {
    id: '',
    name: '',
    description: '',
    sortOrder: 0,
    categoryId: '',
    price: 0,
    imageUrl: '',
    isAvailable: true,
    station: '1',
    components: [] as { name: string; station: string }[],
    variations: [] as { name: string; price: number }[],
  };

  loading = signal(false);
  errorMessage = signal('');
  isUploadingImage = signal(false);
  showAddVariationModal = signal(false);
  newVarName = '';
  newVarPrice: number | null = null;
  variationError = '';

  constructor(
    public dialogRef: MatDialogRef<DialogoProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product },
  ) {
    if (data.product) {
      this.isEditing = true;
      const p = data.product;
      this.productData = {
        id: p.id ?? '',
        name: p.name ?? '',
        description: p.description ?? '',
        sortOrder: p.sortOrder ?? 0,
        categoryId: p.categoryId ?? '',
        price: p.price ?? 0,
        imageUrl: p.imageUrl ?? '',
        isAvailable: p.isAvailable ?? true,
        station: p.station ?? '1',
        components: [...(p.components || [])],
        variations: [...(p.variations || [])],
      };
    } else if (this.categories().length > 0) {
      this.productData.categoryId = this.categories()[0].id;
    }
  }

  async uploadImage(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    this.isUploadingImage.set(true);
    this.errorMessage.set('');
    try {
      this.productData.imageUrl = await this.productFacade.uploadImage(file);
    } catch {
      this.errorMessage.set('Fallo la carga de la imagen.');
    } finally {
      this.isUploadingImage.set(false);
    }
  }

  addVariation() {
    this.newVarName = '';
    this.newVarPrice = null;
    this.variationError = '';
    this.showAddVariationModal.set(true);
  }
  confirmAddVariation() {
    if (!this.newVarName.trim() || this.newVarPrice === null || this.newVarPrice < 0) {
      this.variationError = 'Ingresa un nombre y precio válido.';
      return;
    }
    this.productData.variations.push({ name: this.newVarName.trim(), price: this.newVarPrice });
    this.productData.price = Math.min(...this.productData.variations.map((v) => v.price));
    this.showAddVariationModal.set(false);
  }
  removeVariation(index: number) {
    this.productData.variations.splice(index, 1);
    if (this.productData.variations.length > 0)
      this.productData.price = Math.min(...this.productData.variations.map((v) => v.price));
  }

  async onSave() {
    if (!this.productData.name || !this.productData.categoryId) {
      this.errorMessage.set('Completa el nombre y la categoría.');
      return;
    }
    this.loading.set(true);
    try {
      await this.productFacade.saveProduct(this.productData, this.isEditing);
      this.dialogRef.close(true);
    } catch {
      this.errorMessage.set('Error al guardar.');
      this.loading.set(false);
    }
  }
}
