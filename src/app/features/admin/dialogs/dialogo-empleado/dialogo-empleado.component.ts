import { Component, Inject, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StaffFacade } from '../../facades/staff.facade';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KInputComponent } from '../../../../ui/base/input/input.component';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';

import { User } from '../../../../core/domain/staff/staff.model';

@Component({
  selector: 'app-dialogo-empleado',
  standalone: true,
  imports: [FormsModule, KButtonComponent, KInputComponent, KBadgeComponent, KPageHeaderComponent],
  templateUrl: './dialogo-empleado.component.html'
})
export class DialogoEmpleadoComponent {
  private staffFacade = inject(StaffFacade);

  isEditing = false;
  userData = { uid: '', name: '', email: '', role: 'waiter' };
  passText = '';
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    public dialogRef: MatDialogRef<DialogoEmpleadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { employee?: User },
  ) {
    if (data.employee) {
      this.isEditing = true;
      const e = data.employee;
      this.userData = {
        uid: e.uid || e.id || '',
        name: e.name ?? '',
        email: e.email ?? '',
        role: e.role ?? 'waiter'
      };
    }
  }

  async onSave() {
    if (!this.userData.name || !this.userData.email) { this.errorMessage.set('Nombre y correo son obligatorios.'); return; }
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      if (this.isEditing) {
        // updateEmployee(id, { name, role, password })
        await this.staffFacade.updateEmployee(this.userData.uid, { 
          name: this.userData.name, 
          role: this.userData.role, 
          password: this.passText 
        });
      } else {
        // createEmployee({ name, email, role, password })
        await this.staffFacade.createEmployee({ 
          name: this.userData.name, 
          email: this.userData.email, 
          role: this.userData.role, 
          password: this.passText 
        });
      }
      this.dialogRef.close(true);
    } catch (err) { 
      const message = err instanceof Error ? err.message : 'Error al guardar.';
      this.errorMessage.set(message); 
    } finally { 
      this.loading.set(false); 
    }
  }
}
