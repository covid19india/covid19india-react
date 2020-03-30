import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';

i18n.use(XHR).init({
  debug: false,
  lng: 'en',
  fallbackLng: 'en',
  backend: {
    loadPath: '/locales/{{lng}}.json',
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
