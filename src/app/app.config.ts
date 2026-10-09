import { ApplicationConfig, DEFAULT_CURRENCY_CODE, InjectionToken, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CurrencyPipe } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './utils/auth.interceptor';

export const DEFAULT_COUNTRY_CODE = new InjectionToken<string>('DEFAULT_COUNTRY_CODE');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: LOCALE_ID, useValue: 'it-IT'},
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR'},
    CurrencyPipe,
    { provide: DEFAULT_COUNTRY_CODE, useValue: 'IT' }
  ]
};
