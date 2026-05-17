import { Order } from '../../domain/order/order.model';
import { Product } from '../../domain/product/product.model';
import { getThermalTemplateContent } from './raw-printer.helper';

export function normalizeStation(st: string | undefined): string {
  if (!st) return 'C1';
  const upper = st.trim().toUpperCase();
  if (upper === '1' || upper === 'C1') return 'C1';
  if (upper === '2' || upper === 'C2') return 'C2';
  return 'C1';
}

export function getRemainingDescription(description: string | undefined, distributedNames: string[]): string {
  if (!description) return '';
  let cleanDesc = description;
  distributedNames.forEach(name => {
    if (!name) return;
    const escapedName = name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\s*(,\\s*)?${escapedName}\\s*(,\\s*)?`, 'gi');
    cleanDesc = cleanDesc.replace(regex, (match, p1, p2) => {
      return (p1 && p2) ? ', ' : ' ';
    });
  });
  return cleanDesc.replace(/^[\s,]+|[\s,]+$/g, '').trim();
}

interface PrintableInstruction {
  productName: string;
  componentName: string;
  quantity: number;
  station: string;
  notes: string;
  isSplit: boolean;
  variationName?: string;
  localComponents?: string[];
  remainingDescription?: string;
}

export function buildKitchenComandaHtml(order: Order, products: Product[]): string {
  const printableInstructions: PrintableInstruction[] = [];

  order.items.forEach(item => {
    let pName = item.productName || item.name || '';
    const variationName = item.variation || '';
    
    if (variationName) {
      const regex = new RegExp(`\\s*\\(${variationName}\\)\\s*`, 'i');
      pName = pName.replace(regex, ' ').trim();
    }

    let product = products.find(p => p.id === item.productId);
    if (!product && item.productId && item.productId.includes('-')) {
      const baseId = item.productId.split('-')[0];
      product = products.find(p => p.id === baseId);
    }

    const mainStation = normalizeStation(item.station || product?.station || '1');
    const itemComponents = item.components || product?.components || [];
    const localComponents = itemComponents.filter(c => normalizeStation(c.station) === mainStation);
    const distributedComponents = itemComponents.filter(c => normalizeStation(c.station) !== mainStation);

    const distributedNames = distributedComponents.map(c => c.name || '');
    const remainingDesc = getRemainingDescription(product?.description, distributedNames);

    if (itemComponents.length > 0) {
      printableInstructions.push({
        productName: pName,
        componentName: '',
        quantity: item.quantity,
        station: mainStation,
        notes: item.notes || '',
        isSplit: false,
        variationName: variationName,
        localComponents: localComponents.map(c => c.name),
        remainingDescription: remainingDesc,
      });

      distributedComponents.forEach(component => {
        printableInstructions.push({
          productName: pName,
          componentName: component.name || '',
          quantity: item.quantity,
          station: normalizeStation(component.station || '1'),
          notes: item.notes || '',
          isSplit: true,
        });
      });
    } else {
      printableInstructions.push({
        productName: pName,
        componentName: '',
        quantity: item.quantity,
        station: mainStation,
        notes: item.notes || '',
        isSplit: false,
        variationName: variationName,
        remainingDescription: remainingDesc,
      });
    }
  });

  const stationsSet = new Set(printableInstructions.map(i => i.station));
  const stations = Array.from(stationsSet).sort();
  const ticketTemplates: string[] = [];
  const time = new Date().toLocaleTimeString('es-PE', { hour12: false });

  stations.forEach(station => {
    const stationInstructions = printableInstructions.filter(i => i.station === station);
    if (stationInstructions.length === 0) return;

    const itemsHtml = stationInstructions.map(instr => `
      <div style="margin-bottom:8px">
        <div style="display:flex;align-items:flex-start">
          <span style="width:25px;font-weight:bold;font-size:14px">${instr.quantity}x</span>
          <div style="flex:1">
            <span style="font-weight:bold;font-size:13px">${instr.productName.toUpperCase()}</span>
            ${instr.isSplit && instr.componentName ? `
              <div style="font-weight:bold;font-size:11px;font-style:italic;margin-top:2px">
                &gt; ${instr.componentName.toUpperCase()}
              </div>
            ` : ''}
            ${!instr.isSplit && instr.variationName ? `
              <div style="font-size:11px;color:#333;margin-top:2px">
                ${instr.variationName}
              </div>
            ` : ''}
            ${!instr.isSplit && instr.remainingDescription ? `
              <div style="font-size:11px;color:#555;margin-top:2px;font-weight:500">
                ${instr.remainingDescription}
              </div>
            ` : ''}
            ${!instr.isSplit && instr.localComponents && instr.localComponents.length > 0 ? 
              instr.localComponents
                .filter(c => !instr.remainingDescription || !instr.remainingDescription.toLowerCase().includes(c.toLowerCase()))
                .map(c => `
                  <div style="font-size:11px;color:#333;margin-top:2px">
                    ${c}
                  </div>
                `).join('')
            : ''}
          </div>
        </div>
        ${instr.notes ? `<div style="padding-left:25px;font-size:11px;font-weight:bold;color:black;margin-top:2px">NOTA: ${instr.notes}</div>` : ''}
      </div>
    `).join('');

    const stationTitle = `COCINA ${station}`;

    const ticketContent = getThermalTemplateContent(
      stationTitle,
      `
        <div style="font-weight:bold;font-size:13px">${order.isDelivery ? 'PARA LLEVAR' : `MESA: ${order.tableNumber || order.tableId}`}</div>
        <div><b>HORA:</b> ${time}</div>
        <div><b>MOZO:</b> ${(order.waiterName || 'STAFF').toUpperCase()}</div>
      `,
      itemsHtml,
      `<div style="text-align:center;font-size:9px;font-weight:bold">*** ESTACIÓN ${station} ***</div>`
    );

    ticketTemplates.push(ticketContent);
  });

  if (ticketTemplates.length > 0) {
    return `
      <html><head><style>
        @page { size: 58mm auto; margin: 0; }
        body { width: 46mm; margin: 0 auto; padding: 0; font-family: monospace; font-size: 10px; line-height: 1.3; color: black; background: white; }
        .ticket-section { padding: 4mm 2mm; page-break-after: always; }
        .ticket-section:last-child { page-break-after: avoid; }
        .c { text-align: center; } .b { font-weight: bold; }
        .div { border-top: 1px dashed black; margin: 5px 0; }
      </style></head><body>
        ${ticketTemplates.map(t => `<div class="ticket-section">${t}</div>`).join('')}
      </body></html>
    `;
  }
  return '';
}

interface CancellationInstruction {
  productName: string;
  componentName: string;
  quantity: number;
  station: string;
  isSplit: boolean;
  variationName?: string;
  localComponents?: string[];
  remainingDescription?: string;
}

export function buildCancellationComandaHtml(order: Order, products: Product[]): string {
  const cancellationInstructions: CancellationInstruction[] = [];

  order.items.forEach(item => {
    let pName = item.productName || item.name || '';
    const variationName = item.variation || '';
    
    if (variationName) {
      const regex = new RegExp(`\\s*\\(${variationName}\\)\\s*`, 'i');
      pName = pName.replace(regex, ' ').trim();
    }

    let product = products.find(p => p.id === item.productId);
    if (!product && item.productId && item.productId.includes('-')) {
      const baseId = item.productId.split('-')[0];
      product = products.find(p => p.id === baseId);
    }

    const mainStation = normalizeStation(item.station || product?.station || '1');
    const itemComponents = item.components || product?.components || [];
    const localComponents = itemComponents.filter(c => normalizeStation(c.station) === mainStation);
    const distributedComponents = itemComponents.filter(c => normalizeStation(c.station) !== mainStation);

    const distributedNames = distributedComponents.map(c => c.name || '');
    const remainingDesc = getRemainingDescription(product?.description, distributedNames);

    if (itemComponents.length > 0) {
      cancellationInstructions.push({
        productName: pName,
        componentName: '',
        quantity: item.quantity,
        station: mainStation,
        isSplit: false,
        variationName: variationName,
        localComponents: localComponents.map(c => c.name),
        remainingDescription: remainingDesc,
      });

      distributedComponents.forEach(component => {
        cancellationInstructions.push({
          productName: pName,
          componentName: component.name || '',
          quantity: item.quantity,
          station: normalizeStation(component.station || '1'),
          isSplit: true,
        });
      });
    } else {
      cancellationInstructions.push({
        productName: pName,
        componentName: '',
        quantity: item.quantity,
        station: mainStation,
        isSplit: false,
        variationName: variationName,
        remainingDescription: remainingDesc,
      });
    }
  });

  const stationsSet = new Set(cancellationInstructions.map(i => i.station));
  const stations = Array.from(stationsSet).sort();
  const ticketTemplates: string[] = [];
  const time = new Date().toLocaleTimeString('es-PE', { hour12: false });

  stations.forEach(station => {
    const stationInstructions = cancellationInstructions.filter(i => i.station === station);
    if (stationInstructions.length === 0) return;

    const itemsHtml = `
      <div style="font-weight:bold;font-size:11px;margin-bottom:6px;color:#e02f2f">FAVOR DE NO PREPARAR:</div>
      ` + stationInstructions.map(instr => {
        return `
          <div style="display:flex;align-items:flex-start;margin-bottom:6px">
            <span style="width:25px;font-weight:bold;font-size:13px">${instr.quantity}x</span>
            <div style="flex:1">
              <span style="font-weight:bold;font-size:12px;text-decoration:line-through;color:#555">${instr.productName.toUpperCase()}</span>
              ${instr.isSplit && instr.componentName ? `
                <div style="font-size:11px;font-style:italic;text-decoration:line-through;color:#555;margin-top:1px">
                  &gt; ${instr.componentName.toUpperCase()}
                </div>
              ` : ''}
              ${!instr.isSplit && instr.variationName ? `
                <div style="font-size:10px;text-decoration:line-through;color:#555;margin-top:1px">
                  ${instr.variationName}
                </div>
              ` : ''}
              ${!instr.isSplit && instr.remainingDescription ? `
                <div style="font-size:10px;text-decoration:line-through;color:#555;margin-top:1px">
                  ${instr.remainingDescription}
                </div>
              ` : ''}
              ${!instr.isSplit && instr.localComponents && instr.localComponents.length > 0 ? 
                instr.localComponents
                  .filter(c => !instr.remainingDescription || !instr.remainingDescription.toLowerCase().includes(c.toLowerCase()))
                  .map(c => `
                    <div style="font-size:10px;text-decoration:line-through;color:#555;margin-top:1px">
                      ${c}
                    </div>
                  `).join('')
              : ''}
            </div>
          </div>
        `;
      }).join('');

    const headerHtml = `
      <div style="border: 2px solid black; padding: 4px; font-weight: bold; font-size: 16px; text-align: center; color: red; margin-bottom: 8px">
        ¡ANULADO!
      </div>
      <div style="text-align:center;font-weight:bold;font-size:13px">COCINA ${station}</div>
      <div style="font-weight:bold;font-size:13px;text-align:center;margin-top:4px">${order.isDelivery ? 'PARA LLEVAR' : `MESA: ${order.tableNumber || order.tableId}`}</div>
      <div style="margin-top:6px"><b>HORA ANULACIÓN:</b> ${time}</div>
      <div><b>MOZO:</b> ${(order.waiterName || 'STAFF').toUpperCase()}</div>
    `;

    const ticketContent = `
      <div>${headerHtml}</div>
      <div class="div"></div>
      <div>${itemsHtml}</div>
      <div class="div"></div>
      <div style="text-align:center;font-size:9px;font-style:italic;font-weight:bold;color:#e02f2f">*** OPERACIÓN CANCELADA ***</div>
    `;

    ticketTemplates.push(ticketContent);
  });

  if (ticketTemplates.length > 0) {
    return `
      <html><head><style>
        @page { size: 58mm auto; margin: 0; }
        body { width: 46mm; margin: 0 auto; padding: 0; font-family: monospace; font-size: 10px; line-height: 1.3; color: black; background: white; }
        .ticket-section { padding: 4mm 2mm; page-break-after: always; }
        .ticket-section:last-child { page-break-after: avoid; }
        .c { text-align: center; } .b { font-weight: bold; }
        .div { border-top: 1px dashed black; margin: 5px 0; }
      </style></head><body>
        ${ticketTemplates.map(t => `<div class="ticket-section">${t}</div>`).join('')}
      </body></html>
    `;
  }
  return '';
}
