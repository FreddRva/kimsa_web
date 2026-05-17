import { Component, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { StaffRepository } from '../../../data/repositories/staff.repository';
import { KInputComponent } from '../../../ui/base/input/input.component';
import { KButtonComponent } from '../../../ui/base/button/button.component';
import { KBadgeComponent } from '../../../ui/base/badge/badge.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [KInputComponent, KButtonComponent, KBadgeComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private staffRepo = inject(StaffRepository);

  email = '';
  password = '';
  loginError = signal<string | null>(null);
  isLoading = signal(false);

  constructor() {
    effect(() => {
      const data = this.authService.currentUserData();
      if (data) {
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
      // 1. Auth por Firestore (Claves manuales de Admin)
      const users = await this.staffRepo.getStaffByEmail(email);
      const user = users.find(u => (u.email || '').toLowerCase() === email);
      
      if (!user) {
        this.loginError.set('EL CORREO ELECTRÓNICO NO EXISTE');
        this.isLoading.set(false);
        return;
      }
      
      if (user.password) {
        if (user.password === this.password) {
          this.authService.setCustomUser(user);
          this.isLoading.set(false);
          return;
        } else {
          this.loginError.set('CONTRASEÑA INCORRECTA');
          this.isLoading.set(false);
          return;
        }
      }
    } catch (e) {
      console.error('Error Firestore Login', e);
    }

    // 2. Firebase Auth Tradicional
    this.authService.login(email, this.password)
      .pipe(
        switchMap((cred) => this.authService.getUserData(cred.user.uid)),
        catchError((err: any) => {
          const code = err?.code || '';
          if (code === 'auth/too-many-requests' || err?.message?.includes('too-many-requests')) {
            this.loginError.set('DEMASIADOS INTENTOS. CUENTA BLOQUEADA TEMPORALMENTE.');
          } else if (
            code === 'auth/invalid-credential' || 
            code === 'auth/wrong-password' || 
            code === 'auth/user-not-found' ||
            err?.message?.includes('invalid-credential')
          ) {
            this.loginError.set('CONTRASEÑA INCORRECTA');
          } else {
            this.loginError.set('ERROR AL INICIAR SESIÓN');
          }
          return of(null);
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((data) => {
        if (!data) return;
        const role = String(data.role ?? '').toLowerCase();
        if (role === 'waiter' || role === 'mozo') this.router.navigate(['/mozo']);
        else if (role === 'cashier' || role === 'cajero') this.router.navigate(['/caja']);
        else if (role === 'admin') this.router.navigate(['/admin']);
        else this.loginError.set('ROL NO RECONOCIDO');
      });
  }
}
