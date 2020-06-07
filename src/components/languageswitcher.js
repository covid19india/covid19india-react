import locales from '../i18n/locales.json';

import classnames from 'classnames';
import React from 'react';
import {XCircle} from 'react-feather';
import {useTranslation} from 'react-i18next';
import {useTransition, animated} from 'react-spring';

const FADE_IN = {
  opacity: 1,
  height: '12.5rem',
  paddingTop: '7.5rem',
  paddingBottom: '7.5rem',
};

const FADE_OUT = {
  opacity: 0,
  height: '0rem',
  paddingTop: '0rem',
  paddingBottom: '0rem',
};

function LanguageSwitcher({showLanguageSwitcher, setShowLanguageSwitcher}) {
  const {i18n} = useTranslation();
  const currentLanguage = Object.keys(locales).includes(i18n?.language)
    ? i18n?.language
    : i18n?.options?.fallbackLng[0];

  const transitions = useTransition(showLanguageSwitcher, null, {
    from: FADE_OUT,
    enter: FADE_IN,
    leave: FADE_OUT,
    config: {
      mass: 1,
      tension: 210,
      friction: 25,
    },
  });

  return transitions.map(({item, key, props}) =>
    item ? (
      <animated.div key={key} className="LanguageSwitcher" style={props}>
        <span
          className="close-button"
          onClick={() => {
            setShowLanguageSwitcher(false);
          }}
        >
          <XCircle width={16} />
        </span>

        <h3>We speak the following languages</h3>

        <div className="languages">
          {Object.keys(locales).map((languageKey) => (
            <div
              key={languageKey}
              className={classnames('language', {
                'is-highlighted': currentLanguage === languageKey,
              })}
              onClick={() => {
                if (i18n) i18n.changeLanguage(languageKey);
              }}
            >
              <span>{locales[languageKey]}</span>
            </div>
          ))}
        </div>
      </animated.div>
    ) : (
      <animated.div></animated.div>
    )
  );
}

export default React.memo(LanguageSwitcher);
