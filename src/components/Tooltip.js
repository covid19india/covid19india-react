import {TOOLTIP_FADE_IN, TOOLTIP_FADE_OUT} from '../animations';
import useViewPort from '../hooks/useViewPort';

import React, {useCallback, useState} from 'react';
import {useTransition, animated} from 'react-spring';

const Tooltip = ({data, children, stateCard = false}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const viewPort = useViewPort();

  const transitions = useTransition(isTooltipVisible, null, {
    from: TOOLTIP_FADE_OUT,
    enter: TOOLTIP_FADE_IN,
    leave: TOOLTIP_FADE_OUT,
    config: {
      mass: 1,
      tension: 210,
      friction: 20,
    },
  });

  const handleClick = useCallback((e) => e.stopPropagation(), []);

  return (
    <span
      className="Tooltip"
      style={{position: 'relative'}}
      onMouseEnter={setIsTooltipVisible.bind(this, true)}
      onMouseLeave={setIsTooltipVisible.bind(this, false)}
      onClick={handleClick.bind(this)}
    >
      {children}

      {transitions.map(({item, key, props}) =>
        item ? (
          <animated.div
            key={key}
            style={
              stateCard && viewPort.width <= 480
                ? {...props, top: '25px', right: '2px'}
                : {...props}
            }
          >
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
