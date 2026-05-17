import { Order } from '../../domain/order/order.model';

export function buildDailySummaryHtml(data: { orders: Order[], cancelledOrders: Order[], total: number, cash: number, card: number, digital: number }): string {
  const date = new Date().toLocaleDateString('es-PE');
  
  return `
    <html><head><style>
      @page { size: A4; margin: 15mm; }
      body { font-family: sans-serif; font-size: 11px; line-height: 1.4; color: #1a1a1a; margin: 0; }
      .hdr { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 8px; }
      .sec { font-size: 12px; font-weight: bold; margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
      .row { display: flex; justify-content: space-between; margin-bottom: 4px; }
      .b { font-weight: bold; }
      table { width: 100%; border-collapse: collapse; margin-top: 8px; }
      th, td { border: 1px solid #ddd; padding: 5px; font-size: 9px; }
      th { background: #f7f7f7; font-weight: bold; }
    </style></head><body>
      <div class="hdr">
        <div><h1 style="font-size:15px;margin:0">REPORTE DIARIO DE CAJA (VENTAS)</h1><div class="b">RESTAURANTE KIMSA</div></div>
        <div style="text-align:right">FECHA: ${date}</div>
      </div>
      <div class="sec">RESUMEN DE CAJA</div>
      <div class="row"><span>VENTAS EN EFECTIVO:</span><span class="b">S/ ${data.cash.toFixed(2)}</span></div>
      <div class="row"><span>VENTAS CON TARJETA:</span><span class="b">S/ ${data.card.toFixed(2)}</span></div>
      <div class="row"><span>VENTAS DIGITALES (YAPE/OTROS):</span><span class="b">S/ ${data.digital.toFixed(2)}</span></div>
      <div style="border-top:1px solid #ddd;margin:6px 0"></div>
      <div class="row b" style="font-size:13px"><span>TOTAL RECAUDADO:</span><span style="color:#16a34a">S/ ${data.total.toFixed(2)}</span></div>
      
      ${data.cancelledOrders.length ? `
        <div class="sec" style="color:#e02f2f">RESUMEN DE ANULACIONES</div>
        <div class="row"><span class="b" style="color:#e02f2f">TOTAL ANULADOS:</span><span class="b" style="color:#e02f2f">S/ ${data.cancelledOrders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2)}</span></div>
        <div class="row"><span>CANTIDAD DE ANULACIONES:</span><span class="b">${data.cancelledOrders.length}</span></div>
      ` : ''}

      <div class="sec">DETALLE DE TRANSACCIONES</div>
      <table>
        <thead><tr><th>HORA</th><th>COMPROBANTE</th><th>DESCRIPCIÓN</th><th>MÉTODO</th><th style="text-align:right">TOTAL</th></tr></thead>
        <tbody>
          ${data.orders.map(o => {
            let pDate: Date = o.paidAt ? (o.paidAt instanceof Date ? o.paidAt : (typeof (o.paidAt as any).toDate === 'function' ? (o.paidAt as any).toDate() : new Date(o.paidAt))) : new Date();
            const tStr = pDate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
            return `<tr><td style="text-align:center">${tStr}</td><td>${o.documentNumber || 'TICKET'}</td><td>${o.isDelivery ? 'LLEVAR' : `MESA ${o.tableNumber || o.tableId}`}</td><td class="b">${(o.paymentMethod || 'EFECTIVO').toUpperCase()}</td><td style="text-align:right;font-weight:bold">S/ ${(o.total || 0).toFixed(2)}</td></tr>`;
          }).join('')}
        </tbody>
      </table>
    </body></html>
  `;
}
