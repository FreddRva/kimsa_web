import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, query, where, onSnapshot } from '@angular/fire/firestore';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private firestore = inject(Firestore);
  
  // Guardamos IDs ya notificados para no repetir el sonido
  private notifiedOrderIds = new Set<string>();
  
  // Sonido de notificación
  private audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

  // Estado de notificaciones
  public notifications = signal<AppNotification[]>([]);
  public unreadCount = signal<number>(0);

  constructor() {
    this.requestPermission();
  }

  async requestPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Permiso de notificación:', permission);
    }
  }

  listenForNewOrdersForCashier() {
    this._listenOrders('Cajero');
  }

  listenForNewOrders() {
    this._listenOrders('Admin');
  }

  private _listenOrders(role: string) {
    const col = collection(this.firestore, 'orders');
    const q = query(col, where('status', '==', 'pending'));

    let isInitialLoad = true;

    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const id = change.doc.id;

          if (!this.notifiedOrderIds.has(id)) {
            const title = role === 'Cajero' ? '🔔 ¡Nuevo Pedido Recibido!' : '🍽️ Nuevo Pedido';
            const body = `Mesa ${data['tableNumber'] || data['tableId']} ha enviado un nuevo pedido.`;
            
            if (!isInitialLoad) {
              this.showNotification(title, body); // Alerta nativa y sonido solo para eventos en tiempo real
            }
            
            // Siempre agregamos a la lista de notificaciones para que el Admin/Cajero esté enterado al ingresar
            this.addNotificationToList(id, title, body);
            this.notifiedOrderIds.add(id);
          }
        }
      });
      isInitialLoad = false;
    });
  }

  private addNotificationToList(id: string, title: string, body: string) {
    const newNotif: AppNotification = {
      id: id + '-' + Date.now(),
      title,
      body,
      timestamp: new Date(),
      read: false
    };

    this.notifications.update(current => [newNotif, ...current].slice(0, 50)); // Mantener max 50
    this.unreadCount.update(c => c + 1);
  }

  public notifyBirthday(customerName: string, daysLeft: number) {
    const title = '🎂 ¡Cumpleaños Cercano!';
    const body = daysLeft === 0 
      ? `¡Hoy es el cumpleaños de ${customerName}!` 
      : `${customerName} cumple años en ${daysLeft} día(s).`;
      
    this.showNotification(title, body);
    this.addNotificationToList('birthday-' + customerName, title, body);
  }

  public markAllAsRead() {
    this.notifications.update(current => 
      current.map(n => ({ ...n, read: true }))
    );
    this.unreadCount.set(0);
  }

  private showNotification(title: string, body: string) {
    this.audio.play().catch(e => console.log('Error al reproducir sonido:', e));

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico'
      });
    }
  }
}
