import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TableRepository } from '../../../../data/repositories/table.repository';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { KCardComponent } from '../../../../ui/card/card.component';
import { KButtonComponent } from '../../../../ui/button/button.component';
import { KBadgeComponent } from '../../../../ui/badge/badge.component';
import { RestaurantTable } from '../../../../shared/models/table.interface';
import { ConfirmDialogComponent } from '../../../../ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-table-view',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, KCardComponent, KButtonComponent, KBadgeComponent],
  templateUrl: './table-view.component.html'
})
export class TableViewComponent {
  @Input() tables: RestaurantTable[] = [];

  private dialog = inject(MatDialog);
  private tableRepo = inject(TableRepository);

  openTableDialog(table?: RestaurantTable) {
    this.dialog.open(TableDialogComponent, {
      width: '400px',
      data: { table },
      panelClass: 'bg-transparent'
    });
  }

  deleteTable(id: string, number: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'bg-transparent',
      data: {
        title: 'Eliminar Mesa',
        message: `¿Estás seguro de que deseas eliminar la Mesa ${number}? Esta acción no se puede deshacer.`,
        confirmText: 'Sí, Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tableRepo.deleteTable(id);
      }
    });
  }
}
