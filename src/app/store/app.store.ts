import { Injectable, signal, computed } from '@angular/core';

export interface UserState {
  uid: string | null;
  email: string | null;
  role: 'admin' | 'waiter' | 'cashier' | null;
  displayName: string | null;
}

@Injectable({ providedIn: 'root' })
export class AppStore {
  // State
  private userState = signal<UserState>({
    uid: null,
    email: null,
    role: null,
    displayName: null
  });

  private loadingState = signal<boolean>(false);

  // Selectors
  user = computed(() => this.userState());
  isAuthenticated = computed(() => !!this.userState().uid);
  isLoading = computed(() => this.loadingState());

  // Actions
  setUser(user: UserState) {
    this.userState.set(user);
  }

  setLoading(isLoading: boolean) {
    this.loadingState.set(isLoading);
  }

  clearUser() {
    this.userState.set({
      uid: null,
      email: null,
      role: null,
      displayName: null
    });
  }
}
