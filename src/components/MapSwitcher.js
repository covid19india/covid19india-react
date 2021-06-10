import {LEVEL_STATISTICS, STATISTIC_CONFIGS} from '../constants';

import classnames from 'classnames';
import {memo, useState, useCallback, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useSpring, animated, config} from 'react-spring';
import {useMeasure} from 'react-use';

const MapSwitcher = ({mapStatistic, setMapStatistic}) => {
  const [mapSwitcher, {width}] = useMeasure();
  const [clicked, setClicked] = useState(false);
  const [count, setCount] = useState(0);

  const isPresent = LEVEL_STATISTICS.indexOf(mapStatistic) >= 0;

  const [spring, springApi] = useSpring(() => ({
    opacity: 0,
    background: `${STATISTIC_CONFIGS[mapStatistic].color}20`,
    transform: isPresent
      ? `translate3d(${
          (width * LEVEL_STATISTICS.indexOf(mapStatistic)) /
          LEVEL_STATISTICS.length
        }px, 0, 0)`
      : null,
    width: `calc(${100 / LEVEL_STATISTICS.length}%)`,
    config: config.gentle,
  }));

  useEffect(() => {
    if (width > 0) {
      const isPresent = LEVEL_STATISTICS.indexOf(mapStatistic) >= 0;
      ReactDOM.unstable_batchedUpdates(() => {
        springApi.start({
          transform: isPresent
            ? `translate3d(${
                (width * LEVEL_STATISTICS.indexOf(mapStatistic)) /
                LEVEL_STATISTICS.length
              }px, 0, 0)`
            : null,
          opacity: isPresent ? 1 : 0,
          background: isPresent
            ? `${STATISTIC_CONFIGS[mapStatistic]?.color}20`
            : null,
          delay: count === 0 ? 1500 : 0,
          onStart: setClicked.bind(this, true),
          onRest: setClicked.bind(this, false),
        });
      });
    }
  }, [count, mapStatistic, springApi, width]);

  const handleClick = useCallback(
    (statistic) => {
      setCount((prevCount) => prevCount + 1);
      setMapStatistic(statistic);
    },
    [setMapStatistic]
  );

  return (
    <div className="MapSwitcher" ref={mapSwitcher}>
      <animated.div className="highlight" style={spring}></animated.div>

      {LEVEL_STATISTICS.map((statistic, index) => (
        <div
          key={index}
          className={classnames('clickable', {[`is-${statistic}`]: !clicked})}
          onClick={handleClick.bind(this, statistic)}
          style={{width: `calc(${100 / LEVEL_STATISTICS.length}%)`}}
        ></div>
      ))}
    </div>
  );
};

const isEqual = (prevProps, currProps) => {
  if (prevProps.mapStatistic !== currProps.mapStatistic) {
    return false;
  }
  return true;
};

export default memo(MapSwitcher, isEqual);
