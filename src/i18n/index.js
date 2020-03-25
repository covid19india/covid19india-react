import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import XHR from 'i18next-xhr-backend';

import bn from './locales/bn.json';
import en from './locales/en.json';
import gu from './locales/gu.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';
import ml from './locales/ml.json';
import mr from './locales/mr.json';
import or from './locales/or.json';
import pa from './locales/pa.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import ur from './locales/ur.json';

i18n
  .use(XHR)
  .use(LanguageDetector)
  .init({
    debug: true,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    resources: {
      en: { translations: en },
      hi: { translations: hi },
      bn: { translations: bn },
      mr: { translations: mr },
      te: { translations: te },
      ta: { translations: ta },
      gu: { translations: gu },
      ur: { translations: ur },
      kn: { translations: kn },
      or: { translations: or },
      ml: { translations: ml },
      pa: { translations: pa }
    },
    ns: ['translations'],
    defaultNS: 'translations'
  });

export default i18n;
