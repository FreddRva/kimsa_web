import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryFacade } from '../../../../core/application/facades/category.facade';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { DialogoCategoriaComponent } from '../../dialogs/dialogo-categoria/dialogo-categoria.component';
import { ConfirmDialogComponent } from '../../../../ui/feedback/confirm-dialog/confirm-dialog.component';
import { CategoryAdminItemComponent } from '../../components/category-admin-item/category-admin-item.component';
import { Category } from '../../../../core/domain/category/category.model';

@Component({
  selector: 'vista-categoria',
  standalone: true,
  imports: [
    MatDialogModule,
    KCardComponent,
    KButtonComponent,
    KPageHeaderComponent,
    CategoryAdminItemComponent,
  ],
  templateUrl: './vista-categoria.component.html',
})
export class VistaCategoriaComponent {
  //inyeccion de dependencias
  public facade = inject(CategoryFacade);
  private dialog = inject(MatDialog);

  //abre el dialogo para editar una categoria
  openCategoryDialog(category?: Category) {
    this.dialog.open(DialogoCategoriaComponent, {
      width: '450px',
      data: { category },
      panelClass: 'bg-transparent',
    });
  }
  //abre el dialogo para eliminar una categoria
  deleteCategory(category: Category) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'bg-transparent',
      data: {
        title: 'Eliminar Categoría',
        message: `¿Eliminar ${category.name}?`,
        confirmText: 'Sí, Eliminar',
      },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.facade.deleteCategory(category.id);
    });
  }
}
