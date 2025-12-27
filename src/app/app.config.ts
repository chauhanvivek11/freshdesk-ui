import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

//ye import kro jis se http client ka use ho ske
import {provideHttpClient} from '@angular/common/http';







export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    //yeh line add krni hai api call krne k liye 
    provideHttpClient()
  ]
};
