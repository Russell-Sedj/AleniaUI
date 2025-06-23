import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// Enregistrer la locale française
registerLocaleData(localeFr);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
