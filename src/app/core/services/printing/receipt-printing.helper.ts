import { Order } from '../../domain/order/order.model';
import { getThermalTemplate } from './raw-printer.helper';

export function buildReceiptHtml(order: Order, paymentMethod?: string): string {
  const total = order.total || 0;
  const sub = total / 1.18;
  
  let paidDate: Date;
  if (order.paidAt) {
    paidDate = order.paidAt instanceof Date 
      ? order.paidAt 
      : (typeof (order.paidAt as any).toDate === 'function' 
          ? (order.paidAt as any).toDate() 
          : new Date(order.paidAt));
  } else {
    paidDate = new Date();
  }

  const itemsHtml = order.items.map(item => `
    <div style="display:flex;justify-content:space-between">
      <span>${item.quantity}x ${item.name}</span>
      <span>S/ ${(item.price * item.quantity).toFixed(2)}</span>
    </div>
    ${item.notes ? `<div style="font-size:8px;font-style:italic;padding-left:10px">* ${item.notes}</div>` : ''}
  `).join('');

  return getThermalTemplate(
    order.documentType === 'Ticket' || !order.documentType ? 'TICKET DE VENTA' : `${order.documentType.toUpperCase()} ELECTRÓNICA`,
    `
      <div><b>CLIENTE:</b> ${(order.customerName || 'PÚBLICO EN GENERAL').toUpperCase()}</div>
      ${order.customerDocument ? `<div><b>DNI/RUC:</b> ${order.customerDocument}</div>` : ''}
      <div><b>FECHA:</b> ${paidDate.toLocaleString('es-PE', { hour12: false })}</div>
      ${!order.isDelivery ? `
        <div><b>MESA:</b> ${order.tableNumber || order.tableId}</div>
        <div><b>MOZO:</b> ${(order.waiterName || 'STAFF').toUpperCase()}</div>
      ` : '<div><b>TIPO:</b> PARA LLEVAR</div>'}
    `,
    itemsHtml,
    `
      <div style="display:flex;justify-content:space-between"><span>GRAVADA:</span><span>S/ ${sub.toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between"><span>IGV (18%):</span><span>S/ ${(total - sub).toFixed(2)}</span></div>
      <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:11px"><span>TOTAL:</span><span>S/ ${total.toFixed(2)}</span></div>
      <div style="text-align:right;font-size:8px;margin-top:6px">Forma de Pago: ${paymentMethod || order.paymentMethod || 'EFECTIVO'}</div>
    `
  );
}
