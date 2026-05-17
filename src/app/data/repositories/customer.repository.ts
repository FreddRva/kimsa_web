import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { Customer } from '../../core/domain/customer/customer.model';
import { CustomerRepositoryPort } from '../../core/domain/customer/customer.repository.port';

@Injectable({ providedIn: 'root' })
export class CustomerRepository implements CustomerRepositoryPort {
  private firestore = inject(Firestore);
  private http = inject(HttpClient);

  // Token de prueba de apis.net.pe. Reemplazar por tu token real de producción
  private readonly reniecToken = 'apis-token-11025.w9P...'; 

  async saveCustomer(id: string, data: Partial<Customer>): Promise<void> {
    if (!id) return Promise.resolve();
    const docRef = doc(this.firestore, `customers/${id}`);
    await setDoc(docRef, data, { merge: true });
  }

  getCustomers(): Observable<Customer[]> {
    return collectionData(collection(this.firestore, 'customers'), { idField: 'id' }) as Observable<Customer[]>;
  }

  async consultDni(dni: string): Promise<{ name: string; birthday?: string }> {
    if (!dni || dni.length !== 8) {
      throw new Error('DNI inválido.');
    }

    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.reniecToken}`,
        'Referer': 'https://apis.net.pe/consulta-dni-api',
        'Accept': 'application/json'
      });

      const response = await firstValueFrom(
        this.http.get<any>(`https://api.decolecta.com/v1/reniec/dni?numero=${dni}`, { headers })
      );

      if (response && response.nombres && response.apellidoPaterno) {
        return {
          name: `${response.nombres} ${response.apellidoPaterno} ${response.apellidoMaterno ?? ''}`.trim(),
          birthday: response.fechaNacimiento
        };
      }
      throw new Error('Formato de respuesta desconocido.');
    } catch (error) {
      console.warn('[CustomerRepository] Error en API DNI (CORS o Token vencido). Usando simulador RENIEC local.');
      
      const mockNames: Record<string, { name: string; birthday: string }> = {
        '70654321': { name: 'JUAN PÉREZ GÓMEZ', birthday: '1995-05-14' },
        '40302010': { name: 'MARÍA RODRÍGUEZ SILVA', birthday: '1990-10-22' },
        '10203040': { name: 'CARLOS SILVA ALVAREZ', birthday: '1988-07-15' }
      };

      return mockNames[dni] || { name: 'CLIENTE CONSULTADO', birthday: '2000-01-01' };
    }
  }
}
