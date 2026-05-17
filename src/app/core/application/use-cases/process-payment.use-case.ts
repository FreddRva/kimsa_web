import { Injectable, inject } from '@angular/core';
import { ORDER_REPOSITORY_TOKEN } from '../../infrastructure/order.token';
import { CustomerFacade } from '../facades/customer.facade';
import { Order } from '../../domain/order/order.model';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ProcessPaymentUseCase {
  private repository = inject(ORDER_REPOSITORY_TOKEN);
  private customerFacade = inject(CustomerFacade);
  private firestore = inject(Firestore);

  async execute(order: Order, method: string, docType: string, docNumber: string): Promise<void> {
    // 1. Lógica de Cliente
    if (docNumber) {
      this.customerFacade.saveCustomer(docNumber, { dni: docNumber, name: order.customerName })
        .catch(err => console.error('[UseCase] Error saving customer:', err));
    }

    // 2. Lógica de Negocio (SUNAT)
    const isSunatActive = await this.checkSunatSettings();
    if (isSunatActive && docType !== 'Ticket') {
      alert(`[SUNAT] Enviando ${docType}... Comprobante emitido.`);
    }

    // 3. Persistencia
    await this.repository.confirmPayment(order.id, method, order.tableId, docType, docNumber);
  }

  private async checkSunatSettings(): Promise<boolean> {
    try {
      const snap = await getDoc(doc(this.firestore, 'settings/general'));
      return snap.exists() ? (snap.data()['isSunatActive'] || false) : false;
    } catch {
      return false;
    }
  }
}
