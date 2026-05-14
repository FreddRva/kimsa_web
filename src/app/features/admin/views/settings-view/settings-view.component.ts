import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { KCardComponent } from '../../../../ui/card/card.component';
import { KButtonComponent } from '../../../../ui/button/button.component';
import { KInputComponent } from '../../../../ui/input/input.component';

@Component({
  selector: 'app-settings-view',
  standalone: true,
  imports: [CommonModule, FormsModule, KCardComponent, KButtonComponent, KInputComponent],
  templateUrl: './settings-view.component.html'
})
export class SettingsViewComponent {
  private firestore = inject(Firestore);

  businessName = '';
  isSaving = signal(false);

  constructor() {
    this.loadSettings();
  }

  async loadSettings() {
    try {
      const docRef = doc(this.firestore, 'settings/general');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        this.businessName = snap.data()['businessName'] || 'KIMSA POS';
      }
    } catch (e: any) {
      console.error('Error loading settings', e);
    }
  }

  async saveSettings() {
    this.isSaving.set(true);
    try {
      const docRef = doc(this.firestore, 'settings/general');
      await setDoc(docRef, { businessName: this.businessName }, { merge: true });
      alert('Configuración guardada correctamente.');
    } catch (e: any) {
      console.error(e);
      alert('Error al guardar configuración.');
    } finally {
      this.isSaving.set(false);
    }
  }
}
