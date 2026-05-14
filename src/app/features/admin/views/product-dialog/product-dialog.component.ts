import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ProductRepository } from '../../../../data/repositories/product.repository';
import { KInputComponent } from '../../../../ui/input/input.component';
import { KButtonComponent } from '../../../../ui/button/button.component';

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatSlideToggleModule,
    MatIconModule,
    KInputComponent,
    KButtonComponent
  ],
  templateUrl: '../product-dialog/product-dialog.component.html'
})
export class ProductDialogComponent {
  private productRepo = inject(ProductRepository);

  isEditing = false;
  categories: any[] = [];
  
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
    components: [] as {name: string, station: string}[],
    variations: [] as {name: string, price: number}[]
  };

  loading = signal(false);
  errorMessage = signal('');
  isUploadingImage = signal(false);

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: any, categories: any[] }
  ) {
    this.categories = data.categories || [];
    
    if (data.product) {
      this.isEditing = true;
      this.productData = {
        ...data.product,
        components: data.product.components ? [...data.product.components] : [],
        variations: data.product.variations ? [...data.product.variations] : []
      };
    } else if (this.categories.length > 0) {
      this.productData.categoryId = this.categories[0].id;
    }
  }

  async uploadImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.isUploadingImage.set(true);
    this.errorMessage.set('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'kisma_v2'); // Preset de Flutter

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dbhg8cy24/image/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Error al subir imagen a Cloudinary');
      }

      const data = await res.json();
      this.productData.imageUrl = data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      this.errorMessage.set('Fallo la carga de la imagen. Inténtalo de nuevo.');
    } finally {
      this.isUploadingImage.set(false);
    }
  }

  // Variation Modal State
  showAddVariationModal = signal(false);
  newVarName = '';
  newVarPrice: number | null = null;
  variationError = '';

  addVariation() {
    this.newVarName = '';
    this.newVarPrice = null;
    this.variationError = '';
    this.showAddVariationModal.set(true);
  }

  confirmAddVariation() {
    if (!this.newVarName.trim() || this.newVarPrice === null || this.newVarPrice < 0) {
      this.variationError = 'Por favor ingresa un nombre y precio válido.';
      return;
    }
    this.productData.variations.push({ name: this.newVarName.trim(), price: this.newVarPrice });
    this.productData.price = Math.min(...this.productData.variations.map(v => v.price));
    this.showAddVariationModal.set(false);
  }

  removeVariation(index: number) {
    this.productData.variations.splice(index, 1);
    if (this.productData.variations.length > 0) {
      this.productData.price = Math.min(...this.productData.variations.map(v => v.price));
    }
  }

  onSave() {
    if (!this.productData.name || !this.productData.categoryId) {
      this.errorMessage.set('Por favor completa el nombre y la categoría.');
      return;
    }
    
    if (this.productData.variations.length === 0 && this.productData.price <= 0) {
      this.errorMessage.set('Debe tener un precio mayor a 0 o al menos una variante.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const savePromise = this.isEditing 
      ? this.productRepo.updateProduct(this.productData.id, this.productData)
      : this.productRepo.addProduct(this.productData);

    savePromise
      .then(() => this.dialogRef.close(true))
      .catch((err: any) => {
        console.error('Error saving product', err);
        this.errorMessage.set('Error al guardar en base de datos.');
        this.loading.set(false);
      });
  }
}
