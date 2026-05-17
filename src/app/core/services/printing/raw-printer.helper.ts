export function getThermalTemplateContent(title: string, meta: string, items: string, totals: string): string {
  return `
    <div class="c b" style="font-size:12px">${title}</div>
    <div class="div"></div>
    <div>${meta}</div>
    <div class="div"></div>
    <div>${items}</div>
    <div class="div"></div>
    <div>${totals}</div>
  `;
}

export function getThermalTemplate(title: string, meta: string, items: string, totals: string): string {
  return `
    <html><head><style>
      @page { size: 58mm auto; margin: 0; }
      body { width: 46mm; margin: 0 auto; padding: 4mm 2mm; font-family: monospace; font-size: 10px; line-height: 1.3; color: black; background: white; }
      .c { text-align: center; } .b { font-weight: bold; }
      .div { border-top: 1px dashed black; margin: 5px 0; }
    </style></head><body>
      <div class="c b" style="font-size:12px">${title}</div>
      <div class="div"></div>
      <div>${meta}</div>
      <div class="div"></div>
      <div>${items}</div>
      <div class="div"></div>
      <div>${totals}</div>
    </body></html>
  `;
}

export function rawPrint(html: string): void {
  const win = window.open('', '_blank', 'width=350,height=450,menubar=no,toolbar=no,location=no,status=no');
  if (win) {
    win.document.documentElement.innerHTML = html;
    setTimeout(() => {
      try {
        win.focus();
        win.print();
        setTimeout(() => {
          try { win.close(); } catch(e) {}
        }, 1000);
      } catch (err) {
        console.error('Error al imprimir en popup:', err);
      }
    }, 350);
  } else {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.srcdoc = html;
    
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      }, 10000);
    };

    document.body.appendChild(iframe);
  }
}
