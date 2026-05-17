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
    // 1. Verificar si ya existe en la base de datos (incluso si fue eliminado anteriormente)
    const existingUsers = await this.repository.getStaffByEmail(cleanEmail);
    const deletedUser = existingUsers.find((u) => u.isDeleted);
    
    if (deletedUser) {
      // Si estaba eliminado, lo reactivamos automáticamente con los nuevos datos
      await this.repository.updateUser(deletedUser.id ?? deletedUser.uid, {
        name: data.name,
        role: data.role as UserRole,
        isDeleted: false,
      });
      return;
    }

    const activeUser = existingUsers.find((u) => !u.isDeleted);
    if (activeUser) {
      throw new Error('Este correo electrónico ya está registrado por otro empleado activo.');
    }

    try {
      // 2. Si es completamente nuevo, creamos el usuario en Firebase Auth y Firestore
      const newUserAuth = await this.authService.createSecondaryUser(cleanEmail, data.password);
      await this.repository.addUserDoc(newUserAuth.uid, {
        uid: newUserAuth.uid,
        email: cleanEmail,
        name: data.name,
        role: data.role as UserRole,
        password: data.password, // Almacenamos la contraseña en el documento para login directo
        isDeleted: false,
        isActive: true,
      });
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use' || err.message?.includes('email-already-in-use')) {
        throw new Error('El correo electrónico ya se encuentra registrado en el sistema.');
      }
      throw err;
    }
  }

  async updateEmployee(
    id: string,
    data: { name: string; role: string; password?: string },
  ): Promise<void> {
    if (!id) {
      throw new Error('El ID de empleado no es válido o está vacío.');
    }
    const updateData: Partial<User> = { name: data.name, role: data.role as UserRole };
    if (data.password) updateData.password = data.password;
    await this.repository.updateUser(id, updateData);
  }

  async reactivateDeletedEmployee(
    email: string,
    data: { name: string; role: string },
  ): Promise<boolean> {
    const existingUsers = await this.repository.getStaffByEmail(email);
    const deletedUser = existingUsers.find((u) => u.isDeleted);
    if (deletedUser) {
      await this.repository.updateUser(deletedUser.id ?? deletedUser.uid, {
        name: data.name,
        role: data.role as UserRole,
        isDeleted: false,
      });
      return true;
    }
    return false;
  }

  async deleteUser(id: string) {
    await this.repository.deleteUser(id);
  }
}
