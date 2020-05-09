import {isDevelopmentOrTest} from '../utils/commonfunctions';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import {initReactI18next} from 'react-i18next';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: isDevelopmentOrTest(),
    lng: 'en',
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}.json',
      addPath: 'http://localhost:9999/',
    },
    saveMissing: isDevelopmentOrTest(),
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
