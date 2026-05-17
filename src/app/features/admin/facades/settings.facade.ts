import { Injectable, inject, signal } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

export interface AppSettings {
  businessName: string;
  ruc: string;
  sunatToken: string;
  isSunatActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class SettingsFacade {
  private firestore = inject(Firestore);

  isSunatActive = false;
  loading = signal(false);

  async loadSettings(): Promise<AppSettings> {
    const snap = await getDoc(doc(this.firestore, 'settings/general'));
    if (snap.exists()) {
      const d = snap.data();
      this.isSunatActive = d['isSunatActive'] || false;
      return {
        businessName: d['businessName'] || 'KIMSA POS',
        ruc: d['ruc'] || '',
        sunatToken: d['sunatToken'] || '',
        isSunatActive: this.isSunatActive,
      };
    }
    return { businessName: 'KIMSA POS', ruc: '', sunatToken: '', isSunatActive: false };
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await setDoc(doc(this.firestore, 'settings/general'), settings, { merge: true });
    this.isSunatActive = settings.isSunatActive;
  }
}
