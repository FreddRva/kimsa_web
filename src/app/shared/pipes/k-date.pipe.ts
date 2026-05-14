import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kDate',
  standalone: true
})
export class KDatePipe implements PipeTransform {
  transform(value: any, format: 'full' | 'short' | 'time' = 'full'): string {
    if (!value) return '--/-- --:--';
    
    const date = value.toDate ? value.toDate() : new Date(value);
    
    if (isNaN(date.getTime())) return 'Fecha inválida';

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    if (format === 'time') {
      return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    }
    
    if (format === 'short') {
      return `${date.getDate()} ${months[date.getMonth()]}`;
    }

    return `${date.getDate()} ${months[date.getMonth()]}, ${date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`;
  }
}
