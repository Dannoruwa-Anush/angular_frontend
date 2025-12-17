import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './utils/auth_utils/authInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    //----- [Start: Add AuthInterceptor (attaches token) ] -------------
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    ),
    //----- [End: Add AuthInterceptor (attaches token) ] -------------
  ]
};
