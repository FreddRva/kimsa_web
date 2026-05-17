import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, getDoc, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Observable, from, map, switchMap, of } from 'rxjs';
import { initializeApp, getApp } from '@angular/fire/app';
import { getAuth as getSecondaryAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user$ = user(this.auth);
  currentUserData = signal<any>(this.getInitialUserData());

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
        // Si Firebase Auth emite null, solo limpiar si el usuario actual NO es un usuario local persistido
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

  sendPasswordReset(email: string) {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  login(email: string, pass: string) {
    return from(signInWithEmailAndPassword(this.auth, email, pass));
  }

  logout() {
    this.currentUserData.set(null);
    localStorage.removeItem('kimsa_session');
    return from(signOut(this.auth));
  }

  setCustomUser(data: any) {
    this.currentUserData.set(data);
    if (data) {
      localStorage.setItem('kimsa_session', JSON.stringify(data));
    } else {
      localStorage.removeItem('kimsa_session');
    }
  }

  getUserData(uid: string): Observable<any> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDoc)).pipe(
      switchMap((snapshot) => {
        if (snapshot.exists()) {
          return of({ id: snapshot.id, ...snapshot.data() });
        }
        // Fallback: buscar en la colección el documento cuyo campo 'uid' coincida
        const q = query(collection(this.firestore, 'users'), where('uid', '==', uid));
        return from(getDocs(q)).pipe(
          map((snap) => {
            if (!snap.empty) {
              const d = snap.docs[0];
              return { id: d.id, ...d.data() };
            }
            return null;
          })
        );
      })
    );
  }

  async createSecondaryUser(email: string, pass: string) {
    try {
      let secondaryApp;
      try {
        secondaryApp = getApp('SecondaryApp');
      } catch (e) {
        secondaryApp = initializeApp(environment.firebase, 'SecondaryApp');
      }

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
