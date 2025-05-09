// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importer les fichiers de traduction
import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';

i18n
  .use(initReactI18next) // initialisation du support i18next avec React
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation }
    },
    lng: 'en', // langue par défaut
    fallbackLng: 'en', // langue de secours si une traduction est manquante
    interpolation: {
      escapeValue: false // React échappe déjà le contenu
    }
  });

export default i18n;
