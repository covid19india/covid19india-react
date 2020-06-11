import React, {useState} from 'react';
import {useTransition, animated} from 'react-spring';

const FADE_IN = {
  opacity: 1,
  transform: 'translate3d(0, 0px, 0) scale(1)',
  zIndex: 999,
  position: 'absolute',
  pointerEvents: 'none',
};

const FADE_OUT = {
  opacity: 0,
  transform: 'translate3d(0, 0px, 0) scale(0.99)',
  zIndex: 999,
  position: 'absolute',
  pointerEvents: 'none',
};

const Tooltip = ({data, children}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const transitions = useTransition(isTooltipVisible, null, {
    from: FADE_OUT,
    enter: FADE_IN,
    leave: FADE_OUT,
    config: {
      mass: 1,
      tension: 210,
      friction: 20,
    },
  });

  return (
    <span
      className="Tooltip"
      style={{position: 'relative'}}
      onMouseEnter={() => {
        setIsTooltipVisible(true);
      }}
      onMouseLeave={() => {
        setIsTooltipVisible(false);
      }}
    >
      {children}

      {transitions.map(({item, key, props}) =>
        item ? (
          <animated.div key={key} style={props}>
            <div className="message">
              <p
                dangerouslySetInnerHTML={{
                  __html: data.replace(/\n/g, '<br/>'),
                }}
              ></p>
            </div>
          </animated.div>
        ) : (
          <animated.div key={key}></animated.div>
        )
      )}
    </span>
  );
};

export default Tooltip;
