import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { ProductFacade } from '../../../../core/application/facades/product.facade';
import { KHeaderComponent } from '../../../../core/layout/header/header.component';

@Component({
  selector: 'barra-superior-mozo',
  standalone: true,
  imports: [KHeaderComponent],
  templateUrl: './barra-superior-mozo.component.html'
})
export class BarraSuperiorMozoComponent {
  private authService = inject(AuthService);
  private productFacade = inject(ProductFacade);
  private router = inject(Router);

  searchQuery = this.productFacade.searchQuery;

  userName(): string { return this.authService.currentUserData()?.name || 'Mozo'; }
  onLogout() { this.authService.logout().subscribe(() => this.router.navigate(['/login'])); }
}
