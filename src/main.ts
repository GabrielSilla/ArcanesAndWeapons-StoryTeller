import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { setupIcons } from './icons';
import { Browser } from '@capacitor/browser';

setupIcons(); // <-- REGISTRA OS ÍCONES

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

const originalOpen = window.open;