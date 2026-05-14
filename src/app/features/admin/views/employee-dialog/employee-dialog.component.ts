import { Component, Inject, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StaffRepository } from '../../../../data/repositories/staff.repository';
import { AuthService } from '../../../../core/services/auth.service';
import { KButtonComponent } from '../../../../ui/button/button.component';
import { KInputComponent } from '../../../../ui/input/input.component';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    KButtonComponent,
    KInputComponent,
  ],
  templateUrl: '../employee-dialog/employee-dialog.component.html',
  styleUrl: '../employee-dialog/employee-dialog.component.css'
})
export class EmployeeDialogComponent {
  private staffRepo = inject(StaffRepository);
  private authService = inject(AuthService) as AuthService;

  isEditing = false;
  passText = '';

  userData = {
    id: '',
    name: '',
    email: '',
    role: 'waiter',
  };

  loading = signal(false);
  errorMessage = signal('');

  constructor(
    public dialogRef: MatDialogRef<EmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: any },
  ) {
    if (data.user) {
      this.isEditing = true;
      this.userData = {
        id: data.user.id || data.user.uid,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };
    }
  }

  async onSave() {
    if (!this.userData.name || !this.userData.email) {
      this.errorMessage.set('Por favor completa todos los campos.');
      return;
    }

    if (!this.isEditing && this.passText.length < 6) {
      this.errorMessage.set('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      if (this.isEditing) {
        await this.staffRepo.updateUser(this.userData.id, {
          name: this.userData.name,
          role: this.userData.role,
        });
      } else {
        const newUserAuth = await this.authService.createSecondaryUser(
          this.userData.email,
          this.passText,
        );
        await this.staffRepo.addUserDoc(newUserAuth.uid, {
          uid: newUserAuth.uid,
          email: this.userData.email,
          name: this.userData.name,
          role: this.userData.role,
        });
      }
      this.dialogRef.close(true);
    } catch (err: any) {
      console.error('Error saving user', err);
      if (err?.code === 'auth/email-already-in-use') {
        this.errorMessage.set('El correo ya está en uso.');
      } else {
        this.errorMessage.set('Error al guardar: ' + (err?.message || 'Error desconocido'));
      }
      this.loading.set(false);
    }
  }
}
