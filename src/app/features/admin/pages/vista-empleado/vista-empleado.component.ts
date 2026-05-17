import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { StaffFacade } from '../../facades/staff.facade';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { DialogoEmpleadoComponent } from '../../dialogs/dialogo-empleado/dialogo-empleado.component';
import { ConfirmDialogComponent } from '../../../../ui/feedback/confirm-dialog/confirm-dialog.component';
import { EmployeeAdminItemComponent } from '../../components/employee-admin-item/employee-admin-item.component';
import { User } from '../../../../core/domain/staff/staff.model';

@Component({
  selector: 'vista-empleado',
  standalone: true,
  imports: [
    MatDialogModule,
    KCardComponent,
    KButtonComponent,
    KPageHeaderComponent,
    EmployeeAdminItemComponent,
  ],
  templateUrl: './vista-empleado.component.html',
})
export class VistaEmpleadoComponent {
  private staffFacade = inject(StaffFacade);
  private dialog = inject(MatDialog);

  staff = this.staffFacade.staff;

  openEmployeeDialog(employee?: User) {
    this.dialog.open(DialogoEmpleadoComponent, {
      width: '500px',
      data: { employee },
      panelClass: 'bg-transparent',
    });
  }

  deleteEmployee(employee: User) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'bg-transparent',
      data: {
        title: 'Eliminar Empleado',
        message: `¿Eliminar acceso de ${employee.name}?`,
        confirmText: 'Sí, Eliminar',
      },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.staffFacade.deleteUser(employee.uid || employee.id || '');
    });
  }
}
