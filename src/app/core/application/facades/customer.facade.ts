import { Injectable, inject, signal } from '@angular/core';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../infrastructure/customer.token';
import { Customer } from '../../domain/customer/customer.model';
import { NotificationService } from '../../services/notification.service';

@Injectable({ providedIn: 'root' })
export class CustomerFacade {
  private repository = inject(CUSTOMER_REPOSITORY_TOKEN);
  private notificationService = inject(NotificationService);
  //Aqui se guarda la data de los clientes
  customers = signal<Customer[]>([]);
  loading = signal<boolean>(false);
  private notifiedBirthdays = new Set<string>();
  //Esto es para verificar que los cumpla
  constructor() {
    this.loadCustomers();
  }
  //Carga los clientes si hay un error mostrara el mensaje de error
  private loadCustomers() {
    this.loading.set(true);
    this.repository.getCustomers().subscribe({
      next: (data) => {
        this.customers.set(data);
        this.loading.set(false);
        this.checkBirthdays(data);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  private checkBirthdays(list: Customer[]) {
    const today = new Date();
    list
      .filter((c) => {
        if (!c.birthday) return false;
        const [dayStr, monthStr] = c.birthday.split('/');
        const day = parseInt(dayStr, 10),
          month = parseInt(monthStr, 10);
        return (
          month === today.getMonth() + 1 && day >= today.getDate() && day <= today.getDate() + 3
        );
      })
      .forEach((c) => {
        const key = c.id || c.phone || c.dni || c.name || '';
        if (!this.notifiedBirthdays.has(key)) {
          const birthdayVal = c.birthday || '';
          const daysLeft = Math.max(parseInt(birthdayVal.split('/')[0], 10) - today.getDate(), 0);
          this.notificationService.notifyBirthday(c.name || 'Cliente', daysLeft);
          this.notifiedBirthdays.add(key);
        }
      });
  }

  async saveCustomer(id: string, data: Partial<Customer>) {
    await this.repository.saveCustomer(id, data);
  }

  async saveCustomerWithDateFormat(
    customerData: Partial<Customer> & { id?: string },
  ): Promise<void> {
    const id = customerData.id || customerData.dni || customerData.phone;
    if (!id) throw new Error('Se requiere DNI o Celular para identificar al cliente.');
    let birthday = customerData.birthday;
    if (birthday?.includes('-')) {
      const [year, month, day] = birthday.split('-');
      birthday = `${day}/${month}`;
    }
    await this.repository.saveCustomer(id, { ...customerData, birthday });
  }

  async consultDni(dni: string): Promise<{ name: string; birthday?: string }> {
    return await this.repository.consultDni(dni);
  }
}
