import { Component } from '@angular/core';
import { BarraLateralMozoComponent } from './widgets/barra-lateral-mozo/barra-lateral-mozo.component';
import { BarraSuperiorMozoComponent } from './widgets/barra-superior-mozo/barra-superior-mozo.component';
import { VistaMenuComponent } from './pages/vista-menu/vista-menu.component';
import { VistaResumenComponent } from './pages/vista-resumen/vista-resumen.component';
import { CartStore } from './store/cart.store';
import { ActiveOrderStore } from './store/active-order.store';

@Component({
  selector: 'app-waiter',
  standalone: true,
  providers: [CartStore, ActiveOrderStore],
  imports: [
    BarraLateralMozoComponent,
    BarraSuperiorMozoComponent,
    VistaMenuComponent,
    VistaResumenComponent,
  ],
  templateUrl: './waiter.component.html',
})
export class WaiterComponent {}
