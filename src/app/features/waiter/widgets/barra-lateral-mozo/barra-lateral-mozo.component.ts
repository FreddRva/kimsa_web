import { Component, inject, computed } from '@angular/core';
import { CategoryFacade } from '../../../../core/application/facades/category.facade';
import { ProductFacade } from '../../../../core/application/facades/product.facade';
import { KCategoryBarComponent, KCategoryItem } from '../../../../ui/layout/category-bar/category-bar.component';

@Component({
  selector: 'barra-lateral-mozo',
  standalone: true,
  imports: [KCategoryBarComponent],
  templateUrl: './barra-lateral-mozo.component.html',
})
export class BarraLateralMozoComponent {
  private categoryFacade = inject(CategoryFacade);
  private productFacade = inject(ProductFacade);

  categories = this.categoryFacade.categories;
  selectedCategory = this.productFacade.selectedCategory;
  isPopular = this.productFacade.isPopular;

  categoryItems = computed<KCategoryItem[]>(() => {
    return this.categories().map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: this.iconFor(cat.name)
    }));
  });

  onSelectCategory(name: string) {
    this.isPopular.set(false);
    this.selectedCategory.set(name);
  }

  onSelectPopular() {
    this.isPopular.set(true);
    this.selectedCategory.set('');
  }

  iconFor(name: string): string {
    const n = (name || '').toLowerCase();
    if (n.includes('pizza')) return 'local_pizza';
    if (n.includes('burger') || n.includes('hamburg')) return 'lunch_dining';
    if (n.includes('bebida') || n.includes('drink')) return 'local_drink';
    if (n.includes('pasta')) return 'dinner_dining';
    if (n.includes('postre') || n.includes('sweet')) return 'icecream';
    if (n.includes('pollo')) return 'set_meal';
    return 'fastfood';
  }
}
