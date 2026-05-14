import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  showPassword = false;
  loginError: string | null = null;
  readonly isLoading = signal(false);

  readonly particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    s: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    duration: Math.random() * 50 + 20,
  }));

  onLogin(ev: Event) {
    ev.preventDefault();
    this.loginError = null;
    const email = this.email.trim();
    if (!email || !this.password) {
      this.loginError = 'COMPLETA TODOS LOS CAMPOS';
      return;
    }
    this.isLoading.set(true);
    this.authService
      .login(email, this.password)
      .pipe(
        switchMap((cred) => this.authService.getUserData(cred.user.uid)),
        catchError((err) => {
          this.loginError =
            typeof err?.message === 'string' ? err.message.toUpperCase() : 'NO SE PUDO INICIAR SESIÓN';
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((data) => {
        if (data == null) {
          if (!this.loginError) this.loginError = 'USUARIO SIN PERFIL';
          return;
        }
        const role = String((data as { role?: string }).role ?? '').toLowerCase();
        if (role === 'kitchen' || role === 'cocina') {
          this.loginError = 'ESTE ROL YA NO ESTÁ ACTUADO EN EL SISTEMA';
          this.authService.logout().subscribe();
          return;
        }
        if (role === 'waiter' || role === 'mozo') this.router.navigate(['/mozo']);
        else if (role === 'cashier' || role === 'cajero') this.router.navigate(['/caja']);
        else if (role === 'admin') this.router.navigate(['/admin']);
        else this.loginError = 'ROL NO RECONOCIDO';
      });
  }
}
