import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TableFacade } from '../../../../core/application/facades/table.facade';
import { RestaurantTable } from '../../../../core/domain/table/table.model';
import { KCardComponent } from '../../../../ui/base/card/card.component';

@Component({
  selector: 'app-dialogo-mesa',
  standalone: true,
  imports: [KCardComponent],
  templateUrl: './dialogo-mesa.component.html'
})
export class DialogoMesaComponent {
  private dialogRef = inject(MatDialogRef<DialogoMesaComponent>);
  private tableFacade = inject(TableFacade);
  
  tables = this.tableFacade.tables;

  selectTable(table: RestaurantTable) {
    this.dialogRef.close({ type: 'table', data: table });
  }

  onLlevar() {
    this.dialogRef.close({ type: 'delivery' });
  }

  onClose() {
    this.dialogRef.close();
  }
}
