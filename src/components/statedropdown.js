import {STATE_NAMES} from '../constants';

import React, {useState, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import {useTransition, animated} from 'react-spring';
import {useClickAway} from 'react-use';

const StateDropdown = ({stateCode}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const history = useHistory();

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
      >
        {STATE_NAMES[stateCode]}
      </h1>

      {transitions.map(({item, key, props}) =>
        item ? (
          <animated.div className="dropdown" style={props} ref={dropdownRef}>
            {Object.keys(STATE_NAMES)
              .filter((stateCode) => stateCode !== 'UN' && stateCode !== 'TT')
              .map((stateCode) => (
                <h1
                  key={stateCode}
                  className="item"
                  onClick={() => {
                    setShowDropdown(false);
                    history.push(`/state/${stateCode}`);
                  }}
                >
                  {STATE_NAMES[stateCode]}
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
