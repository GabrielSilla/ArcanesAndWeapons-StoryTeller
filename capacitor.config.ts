import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aastorygame.app',
  appName: 'Armas & Arcanos - Storyteller',
  webDir: 'dist/aa-game/browser',
  server: {
    // Permite navegar ou fazer fetch para esses domínios externos
    allowNavigation: [
      'https://api.ttsopenai.com',
    ],
    // Se você estiver usando HTTP sem HTTPS (não recomendado)
    cleartext: true
  }
};

export default config;
