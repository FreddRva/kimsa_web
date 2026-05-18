import { Injectable, inject, signal, computed } from '@angular/core';
import { PRODUCT_REPOSITORY_TOKEN } from '../../infrastructure/product.token';
import { Product } from '../../domain/product/product.model';
import { CategoryFacade } from './category.facade';
import { ProductRepository } from '../../../data/repositories/product.repository';

@Injectable({ providedIn: 'root' })
export class ProductFacade {
  private repository = inject(PRODUCT_REPOSITORY_TOKEN);
  private categoryFacade = inject(CategoryFacade);

  products = signal<Product[]>([]);
  loading = signal<boolean>(false);
  //Aqui se guarda la data de los productos
  searchQuery = signal('');
  isPopular = signal(true);
  selectedCategory = signal('');
  //Aqui va filtrar las categorias y productos
  filteredProducts = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const all = this.products().filter((p) => !p.isDeleted && p.isAvailable !== false);
    if (this.isPopular()) {
      let list = all.slice(0, 20);
      return q ? list.filter((p) => p.name.toLowerCase().includes(q)) : list;
    }
    const categories = this.categoryFacade.categories();
    const cat = categories.find((c) => c.name === this.selectedCategory());
    let list = cat ? all.filter((p) => p.categoryId === cat.id) : [];
    return q ? list.filter((p) => p.name.toLowerCase().includes(q)) : list;
  });

  constructor() {
    this.loadProducts();
  }
  //Carga los productos
  private loadProducts() {
    this.loading.set(true);
    this.repository.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }
  //Agrega un nuevo producto o actualiza uno existente
  async saveProduct(
    productData: Partial<Product> & { id?: string },
    isEditing: boolean,
  ): Promise<void> {
    if (isEditing && productData.id) {
      await this.repository.updateProduct(productData.id, productData);
    } else {
      await this.repository.addProduct(productData);
    }
  }
  //Carga la distribucion de la estacion
  async saveStationDistribution(
    changes: { id: string; station: string; components: { name: string; station: string }[] }[],
  ): Promise<void> {
    await Promise.all(
      changes.map((c) =>
        this.repository.updateProduct(c.id, { station: c.station, components: c.components }),
      ),
    );
  }
  //Sube la imagen del producto
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'kisma_v2');
    //Cloudinary
    const res = await fetch('https://api.cloudinary.com/v1_1/dbhg8cy24/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Error al subir imagen a Cloudinary');
    const data = await res.json();
    return data.secure_url;
  }
  //Elimina el producto
  async deleteProduct(id: string): Promise<void> {
    await this.repository.updateProduct(id, { isDeleted: true });
  }
}
