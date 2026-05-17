/**
 * ES EL ENCARGADO DE CONECTAR NUESTRA APLICACION CON LOS SERVICIOS DE GOOGLE 
 * AUTH Y FIREBASE, LE DA LA ENERGIA PARA PODER COMUNICARSE CON LOS SERVIDORES DE GOOGLE
 * Y PODER TRAER LA DATA, TAMBIEN LA CACHE PARA QUE EL SISTEMA PUEDA FUNCIONAR SIN INTERNET.

 */

import { provideFirebaseApp, initializeApp, getApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import {
  provideFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from '@angular/fire/firestore';
import { EnvironmentProviders } from '@angular/core';
import { environment } from '../../../../environments/environment';

export const firebaseProviders: EnvironmentProviders[] = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => getAuth()),
  provideFirestore(() =>
    initializeFirestore(getApp(), {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    }),
  ),
];
