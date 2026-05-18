import { Component, Inject, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableFacade } from '../../../../core/application/facades/table.facade';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KInputComponent } from '../../../../ui/base/input/input.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';
import { RestaurantTable, TableStatus } from '../../../../core/domain/table/table.model';

@Component({
  selector: 'app-dialogo-mesa-admin',
  standalone: true,
  imports: [FormsModule, KButtonComponent, KInputComponent, KPageHeaderComponent, KBadgeComponent],
  templateUrl: './dialogo-mesa.component.html',
})
export class DialogoMesaAdminComponent {
  private tableFacade = inject(TableFacade);

  isEditing = false;
  tableData: { id: string; number: string; capacity: number; status: TableStatus } = {
    id: '',
    number: '',
    capacity: 4,
    status: 'available' as TableStatus,
  };

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    public dialogRef: MatDialogRef<DialogoMesaAdminComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { table?: RestaurantTable },
  ) {
    if (data.table) {
      this.isEditing = true;
      const t = data.table;
      this.tableData = {
        id: t.id ?? '',
        number: t.number ?? '',
        capacity: t.capacity ?? 4,
        status: t.status ?? ('available' as TableStatus),
      };
    }
  }

  async onSave() {
    if (!this.tableData.number || !this.tableData.capacity) {
      this.errorMessage.set('Completa todos los campos.');
      return;
    }
    this.loading.set(true);
    try {
      if (this.isEditing) await this.tableFacade.updateTable(this.tableData.id, this.tableData);
      else await this.tableFacade.addTable(this.tableData);
      this.dialogRef.close(true);
    } catch {
      this.errorMessage.set('Error al guardar.');
      this.loading.set(false);
    }
  }
}
