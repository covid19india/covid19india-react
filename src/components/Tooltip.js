import {TOOLTIP_FADE_IN, TOOLTIP_FADE_OUT} from '../animations';
import useViewPort from '../hooks/useViewPort';

import {useCallback, useState} from 'react';
import {useTransition, animated} from 'react-spring';

const Tooltip = ({data, children, stateCard}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const viewPort = useViewPort();

  const transitions = useTransition(isTooltipVisible, {
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

      {transitions(
        (style, item) =>
          item && (
            <animated.div
              style={
                stateCard && viewPort.width <= 480
                  ? {...style, top: '25px', right: '2px'}
                  : {...style}
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
          )
      )}
    </span>
  );
};

export default Tooltip;
