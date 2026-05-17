import { Injectable, inject } from '@angular/core';
import { Order } from '../domain/order/order.model';
import { ProductFacade } from '../application/facades/product.facade';
import { rawPrint } from './printing/raw-printer.helper';
import { buildReceiptHtml } from './printing/receipt-printing.helper';
import { buildDailySummaryHtml } from './printing/summary-printing.helper';
import { buildKitchenComandaHtml, buildCancellationComandaHtml } from './printing/kitchen-printing.helper';

@Injectable({ providedIn: 'root' })
export class PrintingService {
  private productFacade = inject(ProductFacade);

  /**
   * Imprime el comprobante de venta (Formato Térmico 58mm)
   */
  printReceipt(order: Order, paymentMethod?: string): void {
    const html = buildReceiptHtml(order, paymentMethod);
    rawPrint(html);
  }

  /**
   * Imprime la comanda de cocina por estaciones (Formato Térmico 58mm)
   * Distribuye el plato y sus componentes/adicionales según las reglas de cocina (estaciones dinámicas igual a Flutter)
   */
  printKitchenComanda(order: Order): void {
    const products = this.productFacade.products();
    const html = buildKitchenComandaHtml(order, products);
    if (html) {
      rawPrint(html);
    }
  }

  /**
   * Imprime el ticket de ANULACIÓN para la COCINA (Comanda cancelada, igual a Flutter)
   */
  printCancellationComanda(order: Order): void {
    const products = this.productFacade.products();
    const html = buildCancellationComandaHtml(order, products);
    if (html) {
      rawPrint(html);
    }
  }

  /**
   * Imprime el reporte de cierre de caja diario (Formato A4)
   */
  printDailySummary(data: { orders: Order[], cancelledOrders: Order[], total: number, cash: number, card: number, digital: number, config?: any }): void {
    const html = buildDailySummaryHtml(data);
    rawPrint(html);
  }
}
