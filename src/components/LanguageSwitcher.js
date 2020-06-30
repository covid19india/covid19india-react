import {ENTER_IN, ENTER_OUT} from '../animations';
import locales from '../i18n/locales.json';

import classnames from 'classnames';
import React, {useRef, useCallback} from 'react';
import {ArrowUp} from 'react-feather';
import {useTranslation} from 'react-i18next';
import {useTransition, animated} from 'react-spring';
import {useClickAway} from 'react-use';

function LanguageSwitcher({showLanguageSwitcher, setShowLanguageSwitcher}) {
  const {i18n} = useTranslation();
  const currentLanguage = Object.keys(locales).includes(i18n?.language)
    ? i18n?.language
    : i18n?.options?.fallbackLng[0];

  const transitions = useTransition(showLanguageSwitcher, null, {
    from: ENTER_OUT,
    enter: ENTER_IN,
    leave: ENTER_OUT,
    config: {
      mass: 1,
      tension: 100,
      friction: 15,
    },
  });

  const languageSwitcherRef = useRef();
  useClickAway(languageSwitcherRef, () => {
    setShowLanguageSwitcher(false);
  });

  const switchLanguage = useCallback(
    (languageKey) => {
      if (i18n) i18n.changeLanguage(languageKey);
    },
    [i18n]
  );

  return transitions.map(({item, key, props}) =>
    item ? (
      <animated.div
        key={key}
        className="LanguageSwitcher"
        style={props}
        ref={languageSwitcherRef}
      >
        <h3>We speak the following languages</h3>

        <div className="languages">
          {Object.keys(locales).map((languageKey) => (
            <div
              key={languageKey}
              className={classnames('language', {
                'is-highlighted': currentLanguage === languageKey,
              })}
              onClick={switchLanguage.bind(this, languageKey)}
            >
              <span>{locales[languageKey]}</span>
            </div>
          ))}
        </div>

        <div
          className="close-button"
          onClick={setShowLanguageSwitcher.bind(this, false)}
        >
          <ArrowUp width={16} />
        </div>
      </animated.div>
    ) : (
      <animated.div key={key}></animated.div>
    )
  );
}

export default React.memo(LanguageSwitcher);
