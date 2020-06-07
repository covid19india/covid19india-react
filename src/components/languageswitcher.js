import locales from '../i18n/locales.json';

import Button from '@primer/components/lib/Button';
import SelectMenu from '@primer/components/lib/SelectMenu';
import React from 'react';
import {useTranslation} from 'react-i18next';

function LanguageSwitcher() {
  const {i18n} = useTranslation();
  const currentLanguage = Object.keys(locales).includes(i18n?.language)
    ? i18n?.language
    : i18n?.options?.fallbackLng[0];

  return (
    <div className="LanguageSwitcher">
      <SelectMenu>
        <Button as="summary" className="button">
          {locales[currentLanguage]}
        </Button>
        <SelectMenu.Modal className="select-menu-modal">
          <SelectMenu.List className="select-menu-list">
            {Object.entries(locales).map(([key, language]) => (
              <SelectMenu.Item
                key={key}
                className="select-menu-item"
                onClick={() => {
                  if (i18n) i18n.changeLanguage(key);
                }}
                selected={currentLanguage === key}
              >
                {language}
              </SelectMenu.Item>
            ))}
          </SelectMenu.List>
        </SelectMenu.Modal>
      </SelectMenu>
    </div>
  );
}

export default React.memo(LanguageSwitcher);
