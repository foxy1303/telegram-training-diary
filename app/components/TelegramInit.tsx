'use client';

import { useEffect } from 'react';
import TelegramWebApps from '@twa-dev/sdk';

export function TelegramInit() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      TelegramWebApps.ready();
      TelegramWebApps.expand();

      const tg = TelegramWebApps;
      
      // Set theme colors based on Telegram theme
      if (tg.themeParams) {
        const root = document.documentElement;
        if (tg.themeParams.bg_color) {
          root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
        }
        if (tg.themeParams.text_color) {
          root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
        }
        if (tg.themeParams.button_color) {
          root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
        }
        if (tg.themeParams.button_text_color) {
          root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
        }
      }

      console.log('Telegram Web Apps initialized');
      console.log('User:', tg.initDataUnsafe?.user);
    }
  }, []);

  return null;
}
