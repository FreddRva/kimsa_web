import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'k-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class KButtonComponent {
  // PROPIEDADES DE ENTRADA Y COMPORTAMIENTO DE DISEÑO
  @Input() variant:
    | 'primary'
    | 'danger'
    | 'ghost'
    | 'glass'
    | 'luxury'
    | 'info'
    | 'success'
    | 'glass-interactive'
    | 'ghost-success'
    | 'ghost-danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() pill = false;
  @Input() customClass = '';

  // DISPARADOR Y CONTROL DE EVENTOS DE CLIC SEGUROS DE MANERA GLOBAL
  @Output() kClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled && !this.loading) {
      this.kClick.emit(event);
    }
  }

  // CÁLCULO DINÁMICO DE LOS BORDES REDONDEADOS Y GEOMETRÍA DEL BOTÓN
  getRadiusClass() {
    if (this.pill) return 'rounded-full px-6 py-2.5';
    switch (this.variant) {
      case 'luxury':
        return 'rounded-3xl';
      case 'ghost':
      case 'ghost-success':
      case 'ghost-danger':
        return 'rounded-xl';
      default:
        return 'rounded-2xl';
    }
  }

  // CENTRALIZACIÓN DE COLORES, FONDOS, BORDES Y DEGRADADOS DE VARIANTES DE DISEÑO
  getVariantClass() {
    switch (this.variant) {
      case 'primary':
        // Botón principal de acción (Ej: Guardar, Enviar pedido a cocina, Aceptar)
        return 'bg-gradient-to-br from-k-green to-k-green-dark text-white shadow-[0_10px_30px_-5px_rgba(22,163,74,0.4)] border border-k-green-light/20 hover:shadow-[0_15px_40px_-5px_rgba(22,163,74,0.6)] hover:translate-y-0.5';

      case 'success':
        // Botón de estado activo exitoso (Ej: Mesa seleccionada/disponible, filtros activos)
        return 'bg-gradient-to-br from-k-green to-k-green-dark text-white shadow-[0_10px_30px_-5px_rgba(22,163,74,0.4)] border border-k-green-light/20 hover:shadow-[0_15px_40px_-5px_rgba(22,163,74,0.6)] hover:translate-y-0.5';

      case 'info':
        // Botón de estados informativos especiales (Ej: Delivery / Para Llevar activo)
        return 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-[0_10px_30px_-5px_rgba(59,130,246,0.4)] border border-blue-400/20 hover:shadow-[0_15px_40px_-5px_rgba(59,130,246,0.6)] hover:translate-y-0.5';

      case 'luxury':
        // Botón premium destacado dorado (Ej: Platos populares, promociones destacadas)
        return 'bg-k-gold text-black shadow-[0_10px_40px_-5px_rgba(212,175,55,0.4)] border border-white/20 hover:shadow-[0_20px_50px_-10px_rgba(212,175,55,0.6)] hover:translate-y-0.5 active:scale-95';

      case 'danger':
        // Botón de peligro, eliminación o alerta (Ej: Eliminar empleado, Mesa ocupada/extras, Cancelar)
        return 'bg-gradient-to-br from-k-red to-k-red-dark text-white shadow-[0_10px_30px_-5px_rgba(224,47,47,0.4)] border border-white/10 hover:translate-y-0.5';

      case 'glass':
        // Botón translúcido estilo cristal de fondo (Ej: Estados inactivos, botones secundarios discretos)
        return 'bg-white/[0.03] backdrop-blur-xl text-white border border-white/10 hover:bg-white/[0.08] hover:border-white/20';

      case 'glass-interactive':
        // Botón de cristal que se activa a verde en hover (Ej: Tarjetas de productos en catálogo, variaciones)
        return 'bg-white/[0.03] backdrop-blur-xl text-white border border-white/10 hover:bg-k-green hover:text-black hover:border-k-green/30 hover:shadow-[0_0_15px_rgba(22,163,74,0.4)] hover:translate-y-0.5';

      case 'ghost':
        // Botón plano sin fondo ni bordes (Ej: Cerrar diálogo, Volver atrás de forma discreta)
        return 'bg-transparent text-white/40 hover:text-white hover:bg-white/5';

      default:
        return '';
    }
  }

  // AJUSTE ADAPTATIVO DEL TAMAÑO DE FUENTE, ALTURA Y PADDING EXTERNO
  getSizeClass() {
    switch (this.size) {
      case 'sm':
        return 'px-5 py-2.5 text-[10px]';
      case 'md':
        return 'px-8 py-4 text-[11px]';
      case 'lg':
        return 'px-14 py-6 text-[14px]';
      default:
        return '';
    }
  }
}
