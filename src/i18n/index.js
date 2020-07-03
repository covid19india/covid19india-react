import {isDevelopmentOrTest} from '../utils/commonFunctions';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import {initReactI18next} from 'react-i18next';

const DEBUG = false;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: isDevelopmentOrTest() && DEBUG,
    keySeparator: false,
    returnEmptyString: false,
    fallbackLng: 'english',
    load: 'languageOnly',
    backend: {
      loadPath: 'https://api.covid19india.org/locales/locale_{{lng}}.json',
      addPath: 'http://localhost:9999/',
    },
    saveMissing: isDevelopmentOrTest() && DEBUG,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
