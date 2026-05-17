import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, take, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

const getRoleRoute = (role: string): string => {
  const r = String(role || '').toLowerCase();
  if (r === 'waiter' || r === 'mozo') return '/mozo';
  if (r === 'cashier' || r === 'cajero') return '/caja';
  if (r === 'admin') return '/admin';
  return '/login';
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (): Observable<boolean> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // 1. Si ya tenemos el perfil cargado en memoria (Signal), validar directamente
    const data = authService.currentUserData();
    if (data) {
      const role = String(data.role || '').toLowerCase();
      const isAllowed = allowedRoles.map(r => r.toLowerCase()).includes(role);
      if (isAllowed) return of(true);
      
      const targetRoute = getRoleRoute(role);
      router.navigate([targetRoute]);
      return of(false);
    }

    // 2. Si es una carga directa (ej. recarga con F5), consultar el estado con Firebase Auth
    return authService.user$.pipe(
      take(1),
      switchMap((u) => {
        if (!u) {
          router.navigate(['/login']);
          return of(false);
        }
        return authService.getUserData(u.uid).pipe(
          take(1),
          map((userData) => {
            if (userData && !userData.isDeleted) {
              const role = String(userData.role || '').toLowerCase();
              const isAllowed = allowedRoles.map(r => r.toLowerCase()).includes(role);
              if (isAllowed) {
                authService.setCustomUser(userData);
                return true;
              } else {
                const targetRoute = getRoleRoute(role);
                router.navigate([targetRoute]);
                return false;
              }
            }
            router.navigate(['/login']);
            return false;
          })
        );
      })
    );
  };
};
