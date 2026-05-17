import { Component, inject, signal, computed } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CustomerFacade } from '../../../../core/application/facades/customer.facade';
import { KInputComponent } from '../../../../ui/base/input/input.component';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { DialogoClienteComponent } from '../../dialogs/dialogo-cliente/dialogo-cliente.component';
import { Customer } from '../../../../core/domain/customer/customer.model';

@Component({
  selector: 'vista-cliente-admin',
  standalone: true,
  imports: [
    MatDialogModule,
    KInputComponent,
    KCardComponent,
    KButtonComponent,
    KPageHeaderComponent,
  ],
  templateUrl: './vista-cliente.component.html',
})
export class VistaClienteAdminComponent {
  private customerFacade = inject(CustomerFacade);
  private dialog = inject(MatDialog);

  customers = this.customerFacade.customers;
  filterText = signal('');
  showBirthdaysOnly = signal(false);

  filteredCustomers = computed(() => {
    let list = this.customers();
    const text = this.filterText().toLowerCase();
    if (text)
      list = list.filter(
        (c) =>
          (c.name || '').toLowerCase().includes(text) ||
          (c.phone || '').includes(text) ||
          (c.dni || '').includes(text),
      );
    if (this.showBirthdaysOnly()) {
      const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
      list = list.filter((c) => {
        if (!c.birthday) return false;
        const [, month] = c.birthday.split('/');
        return month === currentMonth;
      });
    }
    return list;
  });

  editCustomer(customer: Customer) {
    this.dialog.open(DialogoClienteComponent, {
      data: { customer },
      width: '500px',
      panelClass: 'bg-transparent',
    });
  }
}
