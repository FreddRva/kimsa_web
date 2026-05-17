import { Component, Inject, inject, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CustomerFacade } from '../../../../core/application/facades/customer.facade';
import { KInputComponent } from '../../../../ui/base/input/input.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { KBadgeComponent } from '../../../../ui/base/badge/badge.component';

import { Customer } from '../../../../core/domain/customer/customer.model';

@Component({
  selector: 'app-dialogo-cliente',
  standalone: true,
  imports: [MatDialogModule, KInputComponent, KButtonComponent, KPageHeaderComponent, KBadgeComponent],
  templateUrl: './dialogo-cliente.component.html'
})
export class DialogoClienteComponent {
  private customerFacade = inject(CustomerFacade);

  isEditing = false;
  customerData = { id: '', dni: '', name: '', phone: '', social: '', birthday: '' };
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    public dialogRef: MatDialogRef<DialogoClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { customer?: Customer },
  ) {
    if (data.customer) {
      this.isEditing = true;
      const c = data.customer;
      this.customerData = {
        id: c.id ?? '',
        dni: c.dni ?? '',
        name: c.name ?? '',
        phone: c.phone ?? '',
        social: c.social ?? '',
        birthday: c.birthday ?? ''
      };
      if (this.customerData.birthday?.includes('/')) {
        const [day, month] = this.customerData.birthday.split('/');
        this.customerData.birthday = `${new Date().getFullYear()}-${month}-${day}`;
      }
    }
  }

  async onSave() {
    if (!this.customerData.name) { this.errorMessage.set('El nombre es obligatorio.'); return; }
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      await this.customerFacade.saveCustomerWithDateFormat(this.customerData);
      this.dialogRef.close(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al guardar.';
      this.errorMessage.set(message);
      this.loading.set(false);
    }
  }
}
