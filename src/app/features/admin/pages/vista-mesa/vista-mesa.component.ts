import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableFacade } from '../../../../core/application/facades/table.facade';
import { DialogoMesaAdminComponent } from '../../dialogs/dialogo-mesa/dialogo-mesa.component';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { RestaurantTable } from '../../../../core/domain/table/table.model';
import { ConfirmDialogComponent } from '../../../../ui/feedback/confirm-dialog/confirm-dialog.component';
import { TableAdminItemComponent } from '../../components/table-admin-item/table-admin-item.component';

@Component({
  selector: 'vista-mesa-admin',
  standalone: true,
  imports: [
    MatDialogModule, 
    KCardComponent, 
    KButtonComponent, 
    KPageHeaderComponent, 
    TableAdminItemComponent
  ],
  templateUrl: './vista-mesa.component.html'
})
export class VistaMesaAdminComponent {
  private tableFacade = inject(TableFacade);
  private dialog = inject(MatDialog);

  tables = this.tableFacade.tables;

  openTableDialog(table?: RestaurantTable) {
    this.dialog.open(DialogoMesaAdminComponent, { width: '400px', data: { table }, panelClass: 'bg-transparent' });
  }

  deleteTable(table: RestaurantTable) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px', panelClass: 'bg-transparent',
      data: { title: 'Eliminar Mesa', message: `¿Eliminar Mesa ${table.number}? Esta acción no se puede deshacer.`, confirmText: 'Sí, Eliminar' }
    });
    ref.afterClosed().subscribe(result => { if (result) this.tableFacade.deleteTable(table.id); });
  }
}
