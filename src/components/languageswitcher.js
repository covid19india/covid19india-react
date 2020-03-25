import React from 'react';
import { useTranslation } from 'react-i18next';
import localeList from '../i18n/locale-list.json';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const onLanguageChange = e => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="select-dropdown">
      <select onChange={onLanguageChange}>
        {Object.entries(localeList).map(([key, lang]) => (
          <option key={key} value={key}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
}
