import {PRIMARY_STATISTICS, COLORS} from '../constants';

import classnames from 'classnames';
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useSpring, animated, config} from 'react-spring';
import {useMeasure} from 'react-use';

const MapSwitcher = ({mapStatistic, setMapStatistic}) => {
  const [mapSwitcher, {width}] = useMeasure();
  const [clicked, setClicked] = useState(false);
  const [count, setCount] = useState(0);
  const [spring, set] = useSpring(() => ({
    opacity: 0,
    background: `${COLORS[mapStatistic]}20`,
    transform: `translateX(${
      width * PRIMARY_STATISTICS.indexOf(mapStatistic) * 0.25
    }px)`,
    config: config.gentle,
  }));

  useEffect(() => {
    if (width > 0) {
      ReactDOM.unstable_batchedUpdates(() => {
        set({
          transform: `translateX(${
            width * PRIMARY_STATISTICS.indexOf(mapStatistic) * 0.25
          }px)`,
          opacity: 1,
          background: `${COLORS[mapStatistic]}20`,
          delay: count === 0 ? 1500 : 0,
          onStart: () => {
            setClicked(true);
          },
          onRest: () => {
            setClicked(false);
          },
        });
      });
    }
  }, [count, mapStatistic, set, width]);

  return (
    <div className="MapSwitcher" ref={mapSwitcher}>
      <animated.div className="highlight" style={spring}></animated.div>

      {PRIMARY_STATISTICS.map((statistic, index) => (
        <div
          key={index}
          className={classnames('clickable', {[`is-${statistic}`]: !clicked})}
          onClick={() => {
            setCount((prevCount) => prevCount + 1);
            setMapStatistic(statistic);
          }}
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

export default React.memo(MapSwitcher, isEqual);
