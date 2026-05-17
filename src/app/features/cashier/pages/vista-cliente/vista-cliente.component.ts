import { Component, inject, signal, computed } from '@angular/core';
import { CustomerFacade } from '../../../../core/application/facades/customer.facade';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KInputComponent } from '../../../../ui/base/input/input.component';
import { CustomerItemComponent } from '../../components/customer-item/customer-item.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';

@Component({
  selector: 'vista-cliente',
  standalone: true,
  imports: [KCardComponent, KButtonComponent, KInputComponent, KPageHeaderComponent, CustomerItemComponent],
  templateUrl: './vista-cliente.component.html'
})
export class VistaClienteComponent {
  private customerFacade = inject(CustomerFacade);

  customers = this.customerFacade.customers;

  // Form fields
  dni = '';
  name = '';
  phone = '';
  social = '';
  birthday = '';

  isSaving = signal(false);
  isSearchingDni = signal(false);

  // Computeds para UI
  hasDni = computed(() => this.dni.length === 8);

  async searchDni() {
    if (!this.dni || this.dni.length !== 8) return;
    this.isSearchingDni.set(true);
    try {
      const result = await this.customerFacade.consultDni(this.dni);
      this.name = result.name;
      if (result.birthday) {
        this.birthday = result.birthday;
      }
    } catch (error) {
      console.error('Error buscando DNI:', error);
    } finally {
      this.isSearchingDni.set(false);
    }
  }

  async saveCustomer() {
    if (!this.dni && !this.phone) return;
    this.isSaving.set(true);
    try {
      await this.customerFacade.saveCustomerWithDateFormat({
        dni: this.dni, name: this.name, phone: this.phone, social: this.social, birthday: this.birthday
      });
      this.resetForm();
    } catch (e) {
      console.error('Error guardando cliente:', e);
    } finally {
      this.isSaving.set(false);
    }
  }

  resetForm() { this.dni = ''; this.name = ''; this.phone = ''; this.social = ''; this.birthday = ''; }
}
