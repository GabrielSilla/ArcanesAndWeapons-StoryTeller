import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aastorygame.app',
  appName: 'Armas & Arcanos - Storyteller',
  webDir: 'dist/aa-game/browser',
  server: {
    // Se você estiver usando HTTP sem HTTPS (não recomendado)
    cleartext: true
  }
};

export default config;
