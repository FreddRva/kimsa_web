import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyPe',
  standalone: true
})
export class CurrencyPePipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    const amount = typeof value === 'string' ? parseFloat(value) : (value || 0);
    return amount.toLocaleString('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
