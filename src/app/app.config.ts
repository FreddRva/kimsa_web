import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
/**AQUI ESTA LLAMANDO A LOS PROVEEDORES PARA ENCENDER LA APLICACION*/
import { firebaseProviders } from './core/infrastructure/firebase/firebase.providers';
import { repositoryProviders } from './core/infrastructure/repository.providers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    ...firebaseProviders,
    ...repositoryProviders,
  ],
};
