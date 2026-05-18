import { Component, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { KInputComponent } from '../../../ui/base/input/input.component';
import { KButtonComponent } from '../../../ui/base/button/button.component';
import { KBadgeComponent } from '../../../ui/base/badge/badge.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [KInputComponent, KButtonComponent, KBadgeComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loginError = signal<string | null>(null);
  isLoading = signal(false);

  constructor() {
    // Redirección reactiva centralizada
    effect(() => {
      const data = this.authService.currentUserData();
      if (data && !data.isDeleted) {
        const role = String(data.role || '').toLowerCase();
        if (role === 'waiter' || role === 'mozo') this.router.navigate(['/mozo']);
        else if (role === 'cashier' || role === 'cajero') this.router.navigate(['/caja']);
        else if (role === 'admin') this.router.navigate(['/admin']);
      }
    });
  }

  async onLogin() {
    const email = this.email.trim().toLowerCase();
    if (!email || !this.password) {
      this.loginError.set('COMPLETA TODOS LOS CAMPOS');
      return;
    }

    this.isLoading.set(true);
    this.loginError.set(null);

    try {
      // 1. Pre-validación en base de datos (Firestore) a través de AuthService
      const userExists = await this.authService.preValidateEmail(email);
      if (!userExists) {
        this.loginError.set('EL CORREO ELECTRÓNICO NO EXISTE');
        this.isLoading.set(false);
        return;
      }
    } catch (e) {
      console.error('Firestore pre-check error:', e);
      // Si falla la pre-validación por falta de permisos de lectura antes de loguearse,
      // dejamos que el paso 2 (Firebase Auth) haga la autenticación oficial de Google.
    }

    // 2. Autenticación oficial por Firebase Auth (Garantiza token válido de Google)
    this.authService.login(email, this.password)
      .pipe(
        switchMap((cred) => this.authService.getUserData(cred.user.uid)),
        finalize(() => this.isLoading.set(false)),
        catchError((err: any) => {
          const code = err?.code || '';
          const isTooMany = code === 'auth/too-many-requests' || err?.message?.includes('too-many-requests');
          this.loginError.set(isTooMany ? 'DEMASIADOS INTENTOS. CUENTA BLOQUEADA TEMPORALMENTE.' : 'CONTRASEÑA INCORRECTA');
          return of(null);
        })
      )
      .subscribe((data) => {
        if (!data || data.isDeleted) {
          this.loginError.set('EL CORREO ELECTRÓNICO NO EXISTE');
          this.authService.logout().subscribe(); // Desloguear de inmediato por seguridad
          return;
        }
        this.authService.setCustomUser(data);
        const role = String(data.role || '').toLowerCase();
        if (role === 'waiter' || role === 'mozo') this.router.navigate(['/mozo']);
        else if (role === 'cashier' || role === 'cajero') this.router.navigate(['/caja']);
        else if (role === 'admin') this.router.navigate(['/admin']);
      });
  }
}
