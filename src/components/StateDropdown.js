import {MAP_META, STATE_NAMES} from '../constants';

import React, {useState, useCallback, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {useTransition, animated} from 'react-spring';
import {useClickAway} from 'react-use';

const StateDropdown = ({stateCode, trail}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const history = useHistory();
  const {t} = useTranslation();

  useClickAway(dropdownRef, () => {
    setShowDropdown(false);
  });

  const transitions = useTransition(showDropdown, null, {
    from: {
      opacity: 0,
      transform: 'translate3d(0, 2px, 0)',
      zIndex: 999,
    },
    enter: {
      opacity: 1,
      transform: 'translate3d(0, 0px, 0)',
      zIndex: 999,
    },
    leave: {
      opacity: 0,
      transform: 'translate3d(0, 2px, 0)',
      zIndex: 999,
    },
    config: {
      mass: 1,
      tension: 210,
      friction: 20,
    },
  });

  const handleClick = useCallback(
    (stateCodeItr) => {
      setShowDropdown(false);
      history.push(`/state/${stateCodeItr}`);
    },
    [history]
  );

  return (
    <div className="StateDropdown" ref={dropdownRef}>
      <animated.h1
        className="state-name fadeInUp"
        style={trail}
        onClick={setShowDropdown.bind(this, !showDropdown)}
      >
        {t(STATE_NAMES[stateCode])}
      </animated.h1>

      {transitions.map(({item, key, props}) =>
        item ? (
          <animated.div className="dropdown" style={props} key={key}>
            {Object.keys(MAP_META)
              .filter(
                (stateCodeItr) =>
                  stateCodeItr !== 'TT' && stateCodeItr !== stateCode
              )
              .sort((code1, code2) =>
                STATE_NAMES[code1].localeCompare(STATE_NAMES[code2])
              )
              .map((stateCodeItr) => (
                <h1
                  key={stateCodeItr}
                  className="item"
                  onClick={handleClick.bind(this, stateCodeItr)}
                >
                  {t(STATE_NAMES[stateCodeItr])}
                </h1>
              ))}
          </animated.div>
        ) : (
          <animated.div key={stateCode} style={props}></animated.div>
        )
      )}

      {showDropdown && <div className="backdrop"></div>}
    </div>
  );
};

export default StateDropdown;
