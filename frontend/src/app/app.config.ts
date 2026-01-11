import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAyXeRoekSZO0UvTVhu6wF8HhiU2DtaHqY',
  authDomain: 'livemenu-app.firebaseapp.com',
  projectId: 'livemenu-app',
  storageBucket: 'livemenu-app.firebasestorage.app',
  messagingSenderId: '730032631000',
  appId: '1:730032631000:web:22f6f583845d8e74d43bad',
  measurementId: 'G-MDJ8K4HNHB',
};

export function tokenGetter() {
  return localStorage.getItem('token');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter,
          allowedDomains: ['localhost:8080', 'livemenu-server.onrender.com'],
          disallowedRoutes: [
            'localhost:8080/api/v1/auth',
            'livemenu-server.onrender.com/api/v1/auth',
          ],
        },
      })
    ),
  ],
};
