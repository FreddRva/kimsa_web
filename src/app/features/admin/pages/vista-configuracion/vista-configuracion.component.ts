import { Component, inject, signal } from '@angular/core';
import { SettingsFacade } from '../../facades/settings.facade';
import { KCardComponent } from '../../../../ui/base/card/card.component';
import { KButtonComponent } from '../../../../ui/base/button/button.component';
import { KInputComponent } from '../../../../ui/base/input/input.component';
import { KPageHeaderComponent } from '../../../../ui/layout/page-header/page-header.component';
import { KToggleComponent } from '../../../../ui/base/toggle/toggle.component';

@Component({
  selector: 'vista-configuracion',
  standalone: true,
  imports: [KCardComponent, KButtonComponent, KInputComponent, KPageHeaderComponent, KToggleComponent],
  templateUrl: './vista-configuracion.component.html'
})
export class VistaConfiguracionComponent {
  private settingsFacade = inject(SettingsFacade);

  businessName = '';
  ruc = '';
  sunatToken = '';
  isSunatActive = false;
  isSaving = signal(false);

  constructor() { this.load(); }

  async load() {
    try {
      const s = await this.settingsFacade.loadSettings();
      this.businessName = s.businessName;
      this.ruc = s.ruc;
      this.sunatToken = s.sunatToken;
      this.isSunatActive = s.isSunatActive;
    } catch (e) { console.error('Error loading settings', e); }
  }

  async saveSettings() {
    this.isSaving.set(true);
    try {
      await this.settingsFacade.saveSettings({ businessName: this.businessName, ruc: this.ruc, sunatToken: this.sunatToken, isSunatActive: this.isSunatActive });
    } catch (e) { console.error('Error saving settings', e); }
    finally { this.isSaving.set(false); }
  }
}
