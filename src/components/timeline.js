import {addDays, formatISO, differenceInDays, format} from 'date-fns';
import clamp from 'lodash/clamp';
import React, {useState, useEffect, useRef} from 'react';
import {useSprings, animated, config} from 'react-spring';
import {useMeasure} from 'react-use';
import {useGesture} from 'react-use-gesture';

const Timeline = ({setIsTimelineMode, setDate}) => {
  const [days, setDays] = useState([]);
  const [timelineElement, {width}] = useMeasure();
  const [index, setIndex] = useState(0);

  const [springs, set] = useSprings(
    days.length,
    (i) => ({
      x: (index - i) * (480 / 3) + 480 / 2 - 35,
      color: i == 0 ? '#6c757d' : '#6c757d99',
      opacity: i < 2 ? 1 : 0,
    }),
    config.gentle
  );

  const bind = useGesture(
    {
      onDrag: ({
        down,
        delta: [xDelta],
        direction: [xDir],
        distance,
        cancel,
        elapsedTime,
        direction,
      }) => {
        if (down && distance > 75) {
          cancel(
            setIndex(clamp(index + (xDir > 0 ? 1 : -1), 0, days.length - 1))
          );

          setDate(days[index]);
        }

        if (index === 0 && direction[0] === -1) {
          setTimeout(() => {
            setIsTimelineMode(false);
          }, 1000);
        }

        set((i) => {
          if (i < index - 1) {
            return {x: width, color: '#6c757d99', opacity: 0};
          } else if (i > index + 1) {
            return {x: -40, color: '#6c757d99', opacity: 0};
          }
          const x =
            (index - i) * (width / 3) + width / 2 - 35 + (down ? xDelta : 0);
          if (i === index) {
            return {x, display: 'block', color: '#6c757d'};
          }
          return {x, display: 'block', color: '#6c757d99', opacity: 1};
        });
      },
    },
    {rubberband: true}
  );

  useEffect(() => {
    const zeroDay = '2020-03-02';
    const latestDay = new Date();
    const elapsedDays = differenceInDays(latestDay, new Date(zeroDay));
    const daysList = [];

    for (let i = 0; i < elapsedDays; i++) {
      daysList.push(
        formatISO(addDays(new Date(zeroDay), i), {representation: 'date'})
      );
    }

    setDays(daysList.reverse());
  }, [days.length]);

  return (
    <div className="Timeline" ref={timelineElement} {...bind()}>
      {springs
        .filter(
          ({opacity}, i) =>
            i === index + 1 ||
            i === index - 1 ||
            i === index + 2 ||
            i === index - 2 ||
            i === index
        )
        .map(({x, color, opacity}, i) => (
          <animated.div
            className="day"
            key={i}
            style={{
              transform: x.interpolate((x) => `translate3d(${x}px,0,0)`),
              opacity,
            }}
          >
            {index === 0 && (
              <React.Fragment>
                <animated.h5 style={{color}}>
                  {format(new Date(days[index + i + 1]), 'dd MMM')}
                </animated.h5>
              </React.Fragment>
            )}
            {index !== 0 && (
              <React.Fragment>
                <animated.h5 style={{color}}>
                  {format(new Date(days[index + i]), 'dd MMM')}
                </animated.h5>
              </React.Fragment>
            )}
          </animated.div>
        ))}
    </div>
  );
};

export default React.memo(Timeline);
