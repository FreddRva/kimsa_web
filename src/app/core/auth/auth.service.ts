import { Injectable, inject, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User, sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
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
  currentUserData = signal<any>(null);

  constructor() {
    this.user$.subscribe((u) => {
      if (u) {
        this.getUserData(u.uid).subscribe((data) => {
          this.currentUserData.set(data);
        });
      } else {
        this.currentUserData.set(null);
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
    return from(signOut(this.auth));
  }

  setCustomUser(data: any) {
    this.currentUserData.set(data);
  }

  getUserData(uid: string): Observable<any> {
    const userDoc = doc(this.firestore, `users/${uid}`);
    return from(getDoc(userDoc)).pipe(map((snapshot) => snapshot.data()));
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
