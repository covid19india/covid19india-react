import {MAP_META, STATE_NAMES} from '../constants';

import React, {useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import {useTransition, animated} from 'react-spring';
import {useClickAway} from 'react-use';

const StateDropdown = ({stateCode}) => {
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

  return (
    <div className="StateDropdown">
      <h1
        className="state-name"
        onClick={() => {
          setShowDropdown((prevData) => !prevData);
        }}
        ref={dropdownRef}
      >
        {t(STATE_NAMES[stateCode])}
      </h1>

      {transitions.map(({item, key, props}) =>
        item ? (
          <animated.div className="dropdown" style={props} key={key}>
            {Object.keys(MAP_META)
              .filter(
                (stateCodeItr) =>
                  stateCodeItr !== 'TT' && stateCodeItr !== stateCode
              )
              .sort()
              .map((stateCodeItr) => (
                <h1
                  key={stateCodeItr}
                  className="item"
                  onClick={() => {
                    setShowDropdown(false);
                    history.push(`/state/${stateCodeItr}`);
                  }}
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
