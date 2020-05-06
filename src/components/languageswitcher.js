import locales from '../i18n/locales.json';

import React from 'react';
import {useTranslation} from 'react-i18next';

export default function LanguageSwitcher() {
  const {i18n, t} = useTranslation();

  const onLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="select-dropdown">
      <select onChange={onLanguageChange} aria-label={t('Select Language')}>
        {Object.entries(locales).map(([key, lang]) => (
          <option key={key} value={key}>
            {lang === 'English' ? 'Eng' : lang}
          </option>
        ))}
      </select>
    </div>
  );
}
