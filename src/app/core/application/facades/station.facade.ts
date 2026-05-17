import { Injectable, inject, signal, computed } from '@angular/core';
import { ProductFacade } from '../facades/product.facade';

@Injectable({ providedIn: 'root' })
export class StationFacade {
  private productFacade = inject(ProductFacade);
  
  // Estados de la vista
  private _tempStations = signal<{ [key: string]: string }>({});
  private _tempComponents = signal<{ [key: string]: any[] }>({});
  private _hasChanges = signal(false);
  
  public tempStations = computed(() => this._tempStations());
  public tempComponents = computed(() => this._tempComponents());
  public hasChanges = computed(() => this._hasChanges());

  // Opciones estándar
  public stationOptions = [
    { label: 'Estación 01 (Cocina)', value: '1' },
    { label: 'Estación 02 (Bar)', value: '2' },
    { label: 'Estación 03 (Hornos)', value: '3' }
  ];

  public miniStationOptions = [
    { label: 'E1', value: '1' },
    { label: 'E2', value: '2' },
    { label: 'E3', value: '3' }
  ];

  initialize() {
    const stations: { [key: string]: string } = {};
    const components: { [key: string]: any[] } = {};
    
    this.productFacade.products().forEach(p => {
      stations[p.id] = p.station || '1';
      components[p.id] = p.components ? JSON.parse(JSON.stringify(p.components)) : [];
    });

    this._tempStations.set(stations);
    this._tempComponents.set(components);
    this._hasChanges.set(false);
  }

  updateProductStation(productId: string, station: string) {
    this._tempStations.update(prev => ({ ...prev, [productId]: station }));
    this._hasChanges.set(true);
  }

  updateComponentStation(productId: string, index: number, station: string) {
    const comps = [...this._tempComponents()[productId]];
    comps[index].station = station;
    this._tempComponents.update(prev => ({ ...prev, [productId]: comps }));
    this._hasChanges.set(true);
  }

  addComponent(productId: string, name: string) {
    const comps = [...this._tempComponents()[productId], { name, station: '1' }];
    this._tempComponents.update(prev => ({ ...prev, [productId]: comps }));
    this._hasChanges.set(true);
  }

  removeComponent(productId: string, index: number) {
    const comps = [...this._tempComponents()[productId]];
    comps.splice(index, 1);
    this._tempComponents.update(prev => ({ ...prev, [productId]: comps }));
    this._hasChanges.set(true);
  }

  async saveChanges() {
    const products = this.productFacade.products();
    const stations = this._tempStations();
    const components = this._tempComponents();

    const changes = products
      .filter(p => p.station !== stations[p.id] || JSON.stringify(p.components || []) !== JSON.stringify(components[p.id]))
      .map(p => ({ id: p.id, station: stations[p.id], components: components[p.id] }));

    if (changes.length > 0) {
      await this.productFacade.saveStationDistribution(changes);
      this._hasChanges.set(false);
    }
  }
}
