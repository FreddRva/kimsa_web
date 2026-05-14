import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TableRepository } from '../../../../data/repositories/table.repository';
import { KButtonComponent } from '../../../../ui/button/button.component';
import { KInputComponent } from '../../../../ui/input/input.component';

@Component({
  selector: 'app-table-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    KButtonComponent,
    KInputComponent
  ],
  templateUrl: '../table-dialog/table-dialog.component.html',
  styleUrl: '../table-dialog/table-dialog.component.css'
})
export class TableDialogComponent {
  private tableRepo = inject(TableRepository);

  isEditing = false;

  tableData = {
    id: '',
    number: '',
    capacity: 4,
    status: 'available',
  };

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    public dialogRef: MatDialogRef<TableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { table?: any },
  ) {
    if (data.table) {
      this.isEditing = true;
      this.tableData = { ...data.table };
    }
  }

  onSave() {
    if (!this.tableData.number || !this.tableData.capacity) {
      this.errorMessage.set('Por favor completa todos los campos.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const savePromise = this.isEditing
      ? this.tableRepo.updateTable(this.tableData.id, this.tableData)
      : this.tableRepo.addTable(this.tableData);

    savePromise
      .then(() => {
        this.dialogRef.close(true);
      })
      .catch((err: any) => {
        console.error('Error saving table', err);
        this.errorMessage.set('Error al guardar en base de datos.');
        this.loading.set(false);
      });
  }
}
