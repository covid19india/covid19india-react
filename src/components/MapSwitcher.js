import {PRIMARY_STATISTICS, COLORS} from '../constants';

import classnames from 'classnames';
import React, {useState, useEffect} from 'react';
import {useSpring, animated, config} from 'react-spring';
import {useMeasure} from 'react-use';

const MapSwitcher = ({mapStatistic, setMapStatistic}) => {
  const [mapSwitcher, {width}] = useMeasure();
  const [clicked, setClicked] = useState(false);
  const [spring, set] = useSpring(() => ({
    opacity: 0,
    background: `${COLORS[mapStatistic]}20`,
    config: config.gentle,
    onStart: () => {
      setClicked(true);
    },
    onRest: () => {
      setClicked(false);
    },
  }));

  useEffect(() => {
    if (width > 0) {
      setTimeout(() => {
        set({
          transform: `translateX(${
            width * PRIMARY_STATISTICS.indexOf(mapStatistic) * 0.25
          }px)`,
          opacity: 1,
        });
      }, 1000);
    }
  }, [mapStatistic, set, width]);

  return (
    <div className="MapSwitcher" ref={mapSwitcher}>
      <animated.div className="highlight" style={spring}></animated.div>

      {PRIMARY_STATISTICS.map((statistic, index) => (
        <div
          key={index}
          className={classnames('clickable', {[`is-${statistic}`]: !clicked})}
          onClick={() => {
            setMapStatistic(statistic);
            set({
              background: `${COLORS[statistic]}20`,
              transform: `translateX(${width * index * 0.25}px)`,
            });
          }}
        ></div>
      ))}
    </div>
  );
};

const isEqual = (prevProps, currProps) => {
  return true;
};

export default React.memo(MapSwitcher, isEqual);
