import { Injectable, inject, signal } from '@angular/core';
import { User, UserRole } from '../../../core/domain/staff/staff.model';
import { AuthService } from '../../../core/auth/auth.service';
import { STAFF_REPOSITORY_TOKEN } from '../../../core/infrastructure/staff.token';

@Injectable({ providedIn: 'root' })
export class StaffFacade {
  private repository = inject(STAFF_REPOSITORY_TOKEN);
  private authService = inject(AuthService);

  staff = signal<User[]>([]);
  loading = signal<boolean>(false);

  constructor() {
    this.loadStaff();
  }

  private loadStaff() {
    this.loading.set(true);
    this.repository.getStaff().subscribe({
      next: (data: User[]) => {
        this.staff.set(data);
        this.loading.set(false);
      },
      error: (err: unknown) => {
        console.error(err);
        this.loading.set(false);
      },
    });
  }

  async createEmployee(data: {
    name: string;
    email: string;
    role: string;
    password: string;
  }): Promise<void> {
    const cleanEmail = data.email.trim().toLowerCase();
    const existingUsers = await this.repository.getStaffByEmail(cleanEmail);

    // Si existe algún usuario previo con ese correo (ya sea activo o eliminado) en Firestore
    const previousUser = existingUsers[0];

    if (previousUser) {
      // 1. Desactivar y limpiar cualquier registro duplicado fantasma por seguridad
      for (let i = 1; i < existingUsers.length; i++) {
        await this.repository.updateUser(existingUsers[i].id, { isDeleted: true });
      }

      // 2. Reactivar/actualizar el registro principal
      let userId = previousUser.id;
      try {
        const newUserAuth = await this.authService.createSecondaryUser(cleanEmail, data.password);
        userId = newUserAuth.uid;
      } catch (authErr: any) {
        // Si ya está registrado en Firebase Auth, está perfecto, usamos su UID existente
      }

      await this.repository.updateUser(previousUser.id, {
        id: userId,
        name: data.name,
        role: data.role as UserRole,
        isDeleted: false,
        isActive: true,
      });
      return;
    }

    // 3. Si es completamente nuevo, creamos la credencial en Firebase Auth y guardamos el documento
    try {
      const newUserAuth = await this.authService.createSecondaryUser(cleanEmail, data.password);
      await this.repository.addUserDoc(newUserAuth.uid, {
        id: newUserAuth.uid,
        email: cleanEmail,
        name: data.name,
        role: data.role as UserRole,
        isDeleted: false,
        isActive: true,
      });
    } catch (err: any) {
      if (
        err.code === 'auth/email-already-in-use' ||
        err.message?.includes('email-already-in-use')
      ) {
        throw new Error('El correo electrónico ya se encuentra registrado en el sistema.');
      }
      throw err;
    }
  }

  async updateEmployee(
    id: string,
    data: { name: string; role: string; password?: string },
  ): Promise<void> {
    if (!id) throw new Error('El ID del empleado no es válido.');
    const updateData: Partial<User> = { name: data.name, role: data.role as UserRole };
    await this.repository.updateUser(id, updateData);
  }

  async deleteUser(id: string) {
    if (!id) return;
    await this.repository.deleteUser(id);
    this.loadStaff(); // Refrescar el listado inmediatamente
  }
}
