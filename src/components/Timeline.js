import {formatDate, getIndiaDateISO} from '../utils/commonFunctions';

import clamp from 'lodash/clamp';
import React, {useState} from 'react';
import {useSprings, useTransition, animated, config} from 'react-spring';
import {useMeasure, useKeyPressEvent} from 'react-use';
import {useDrag} from 'react-use-gesture';

const Timeline = ({setIsTimelineMode, setDate, dates}) => {
  const [timelineElement, {width}] = useMeasure();
  const [index, setIndex] = useState(0);

  const [springs, set] = useSprings(
    dates.length,
    (i) => ({
      x: (index - i) * (480 / 3) + 480 / 2 - 35,
      color: i === 0 ? '#6c757d' : '#6c757d99',
      opacity: i < 2 ? 1 : 0,
    }),
    config.stiff
  );

  const bind = useDrag(
    ({down, delta: [xDelta], direction: [xDir], distance, cancel}) => {
      const clampedIndex = getClampedIndex(xDir);
      if (down && distance > 25) {
        cancel(setIndex(clampedIndex));
        setClampedDate(clampedIndex);
      }

      if (index === 0 && xDir < 0) {
        hideTimeline();
      }

      setSprings({clampedIndex: index, xDir, down, xDelta});
    }
  );

  const getClampedIndex = (direction) => {
    return clamp(index + (direction > 0 ? 1 : -1), 0, dates.length - 1);
  };

  const setSprings = ({direction, clampedIndex, down, xDelta}) => {
    set((i) => {
      if (i < clampedIndex - 1) {
        return {x: width, color: '#6c757d99', opacity: 0, display: 'none'};
      } else if (i > clampedIndex + 1) {
        return {x: -40, color: '#6c757d99', opacity: 0, display: 'none'};
      }

      let x = 0;
      if (xDelta) {
        x =
          (clampedIndex - i) * (width / 3) +
          width / 2 -
          35 +
          (down ? xDelta : 0);
      } else {
        x = (clampedIndex - i) * (width / 3) + width / 3 + 45;
      }

      if (i === clampedIndex) {
        return {x, color: '#6c757d', display: 'block'};
      }
      return {x, color: '#6c757d99', opacity: 1, display: 'block'};
    });
  };

  const handleKeyPress = (direction) => {
    if (index < dates.length) {
      const clampedIndex = getClampedIndex(direction);
      setSprings({direction, clampedIndex});
      setIndex(clampedIndex);
      setClampedDate(clampedIndex);
    }
    if (index === 1 && direction === -1) {
      hideTimeline();
    }
  };

  useKeyPressEvent('ArrowLeft', () => {
    handleKeyPress(1);
  });

  useKeyPressEvent('ArrowRight', () => {
    handleKeyPress(-1);
  });

  useKeyPressEvent('Escape', () => {
    setIsTimelineMode(false);
    setDate('');
  });

  const hideTimeline = () => {
    setTimeout(() => {
      setIsTimelineMode(false);
    }, 1000);
  };

  const getDate = (index) => {
    if (dates[index] === getIndiaDateISO()) return 'Today';
    return formatDate(dates[index], 'dd MMM');
  };

  const setClampedDate = (clampedIndex) => {
    if (clampedIndex === 0) {
      setDate('');
    } else {
      setDate(dates[clampedIndex]);
    }
  };

  const timeline = {
    '2020-03-25': 'Beginning of Lockdown Phase 1',
    '2020-04-14': 'End of Lockdown Phase 1',
    '2020-04-15': 'Beginning of Lockdown Phase 2',
    '2020-05-03': 'End of Lockdown Phase 2',
    '2020-05-04': 'Beginning of Lockdown Phase 3',
    '2020-05-17': 'End of Lockdown Phase 3',
    '2020-05-18': 'Beginning of Lockdown Phase 4',
    '2020-05-31': 'End of Lockdown Phase 4',
    '2020-06-01': 'Beginning of Lockdown Phase 5',
  };

  const transition = useTransition(
    timeline.hasOwnProperty(dates[index]),
    null,
    {
      from: {transform: 'translate3d(0, 20px, 0)', opacity: 0},
      enter: {transform: 'translate3d(0, 0px, 0)', opacity: 1},
      leave: {transform: 'translate3d(0, 20px, 0)', opacity: 0},
    }
  );

  const handleClick = (clampedIndex) => {
    if (clampedIndex > index) {
      handleKeyPress(+1);
    } else {
      handleKeyPress(-1);
    }
  };

  return (
    <React.Fragment>
      {transition.map(
        ({item, key, props}) =>
          item && (
            <animated.h5 className="highlight" key={key} style={props}>
              {timeline[dates[index]]}
            </animated.h5>
          )
      )}

      <div className="Timeline" ref={timelineElement} {...bind()}>
        {springs
          .filter(
            ({opacity}, i) =>
              i < dates.length &&
              (i === index + 1 ||
                i === index - 1 ||
                i === index + 2 ||
                i === index - 2 ||
                i === index)
          )
          .map(({x, color, opacity, display}, i) => (
            <animated.div
              className="day"
              key={i}
              style={{
                transform: x.interpolate((x) => `translate3d(${x}px,0,0)`),
                opacity,
                display,
              }}
            >
              {index < 2 && (
                <animated.h5
                  style={{color}}
                  onClick={() => {
                    handleClick(i);
                  }}
                >
                  {getDate(i)}
                </animated.h5>
              )}
              {index > 1 && index < dates.length && (
                <animated.h5
                  style={{color}}
                  onClick={() => {
                    handleClick(index + i - 2);
                  }}
                >
                  {getDate(index + i - 2)}
                </animated.h5>
              )}
            </animated.div>
          ))}
      </div>
    </React.Fragment>
  );
};

export default React.memo(Timeline);
