import locales from '../i18n/locales.json';

import Button from '@primer/components/lib/Button';
import SelectMenu from '@primer/components/lib/SelectMenu';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useLocalStorage, useUpdateEffect} from 'react-use';

function LanguageSwitcher() {
  const [language, setLanguage] = useLocalStorage('language', 'english');
  const {i18n} = useTranslation();

  useUpdateEffect(() => {
    if (i18n) i18n.changeLanguage(language);
  }, [i18n, language]);

  return (
    <div className="LanguageSwitcher">
      <SelectMenu>
        <Button as="summary" className="button">
          {locales[language]}
        </Button>
        <SelectMenu.Modal className="select-menu-modal">
          <SelectMenu.List className="select-menu-list">
            {Object.entries(locales).map(([key, language]) => (
              <SelectMenu.Item
                key={key}
                className="select-menu-item"
                onClick={() => {
                  setLanguage(key);
                }}
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
