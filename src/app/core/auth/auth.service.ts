import { Injectable, inject, signal } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Observable, from, map, switchMap, of } from 'rxjs';
import { initializeApp, getApp } from '@angular/fire/app';
import { getAuth as getSecondaryAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { environment } from '../../../environments/environment';
import { STAFF_REPOSITORY_TOKEN } from '../infrastructure/staff.token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private staffRepo = inject(STAFF_REPOSITORY_TOKEN);

  //Obtiene el usuario actual
  user$ = user(this.auth);
  currentUserData = signal<any>(this.getInitialUserData());

  // PRE-VALIDA SI EL CORREO DE UN EMPLEADO EXISTE Y NO ESTÁ ELIMINADO
  async preValidateEmail(email: string): Promise<boolean> {
    try {
      const users = await this.staffRepo.getStaffByEmail(email);
      const activeUser = users.find((u) => (u.email || '').toLowerCase() === email && !u.isDeleted);
      return !!activeUser;
    } catch (e) {
      console.error('[AuthService] Precheck error:', e);
      return true; // En caso de error de conexión inicial, dejamos que Firebase Auth intente loguear
    }
  }

  private getInitialUserData(): any {
    try {
      const stored = localStorage.getItem('kimsa_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  constructor() {
    this.user$.subscribe((u) => {
      if (u) {
        this.getUserData(u.uid).subscribe((data) => {
          if (data && data.isDeleted) {
            this.logout().subscribe();
          } else {
            this.setCustomUser(data);
          }
        });
      } else {
        //Si firebase emite nada, limpiamos la sesion local
        const current = this.currentUserData();
        if (current && current.password) {
          // Mantener la sesión local intacta
        } else {
          this.currentUserData.set(null);
          localStorage.removeItem('kimsa_session');
        }
      }
    });
  }
  //Envio de restablecimiento de contraseña
  sendPasswordReset(email: string) {
    return from(sendPasswordResetEmail(this.auth, email));
  }
  //Inicio de sesion
  login(email: string, pass: string) {
    return from(signInWithEmailAndPassword(this.auth, email, pass));
  }
  //Cierre de sesion
  logout() {
    this.currentUserData.set(null);
    localStorage.removeItem('kimsa_session');
    return from(signOut(this.auth));
  }
  //Establece el usuario actual
  setCustomUser(data: any) {
    this.currentUserData.set(data);
    if (data) {
      localStorage.setItem('kimsa_session', JSON.stringify(data));
    } else {
      localStorage.removeItem('kimsa_session');
    }
  }
  //Obtiene los datos del usuario
  getUserData(uid: string): Observable<any> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDoc)).pipe(
      switchMap((snapshot) => {
        if (snapshot.exists()) {
          return of({ id: snapshot.id, ...snapshot.data() });
        }
        // Busca la coleccion usuarios si no existe el documento
        const q = query(collection(this.firestore, 'users'), where('uid', '==', uid));
        return from(getDocs(q)).pipe(
          map((snap) => {
            if (!snap.empty) {
              const d = snap.docs[0];
              return { id: d.id, ...d.data() };
            }
            return null;
          }),
        );
      }),
    );
  }
  //Crea un usuario secundario
  async createSecondaryUser(email: string, pass: string) {
    try {
      let secondaryApp;
      try {
        secondaryApp = getApp('SecondaryApp');
      } catch (e) {
        secondaryApp = initializeApp(environment.firebase, 'SecondaryApp');
      }
      //Crea el usuario secundario
      const secondaryAuth = getSecondaryAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, pass);
      await secondaryAuth.signOut();
      return userCredential.user;
    } catch (error) {
      console.error('Error creating secondary user:', error);
      throw error;
    }
  }
}
