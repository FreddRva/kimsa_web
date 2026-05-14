import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StaffRepository } from '../../../../data/repositories/staff.repository';
import { EmployeeDialogComponent } from '../employee-dialog/employee-dialog.component';
import { KCardComponent } from '../../../../ui/card/card.component';
import { KButtonComponent } from '../../../../ui/button/button.component';
import { KBadgeComponent } from '../../../../ui/badge/badge.component';
import { User } from '../../../../shared/models/user.interface';
import { ConfirmDialogComponent } from '../../../../ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, KCardComponent, KButtonComponent, KBadgeComponent],
  templateUrl: './employee-view.component.html'
})
export class EmployeeViewComponent {
  @Input() users: User[] = [];

  private dialog = inject(MatDialog);
  private staffRepo = inject(StaffRepository);

  openEmployeeDialog(user?: User) {
    this.dialog.open(EmployeeDialogComponent, {
      width: '400px',
      data: { user },
      panelClass: 'bg-transparent'
    });
  }

  deleteEmployee(id: string, name: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'bg-transparent',
      data: {
        title: 'Eliminar Usuario',
        message: `¿Estás seguro de que deseas eliminar a ${name}? (Solo se borrará de la base de datos de la app). Esta acción no se puede deshacer.`,
        confirmText: 'Sí, Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.staffRepo.deleteUser(id);
      }
    });
  }

  getRoleColor(role: string, opacity: number) {
    const roles: { [key: string]: string } = {
      admin: `rgba(168, 85, 247, ${opacity})`,
      waiter: `rgba(59, 130, 246, ${opacity})`,
      cashier: `rgba(234, 179, 8, ${opacity})`,
      kitchen: `rgba(239, 68, 68, ${opacity})`,
    };
    return roles[role] || `rgba(255, 255, 255, ${opacity})`;
  }
}
