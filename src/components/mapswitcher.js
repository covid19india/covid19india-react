import {PRIMARY_STATISTICS, COLORS} from '../constants';

import React from 'react';
import {useSpring, animated, config} from 'react-spring';
import {useMeasure} from 'react-use';

function MapSwitcher({setMapStatistic}) {
  const [mapSwitcher, {width}] = useMeasure();
  const [spring, set] = useSpring(() => ({
    transform: `translateX(${width * 0}px)`,
    opacity: 0,
    config: config.stiff,
  }));

  setTimeout(() => {
    set({opacity: 1});
  }, 1500);

  return (
    <div className="map-switcher" ref={mapSwitcher}>
      <animated.div className="highlight" style={spring}></animated.div>
      {PRIMARY_STATISTICS.map((statistic, index) => (
        <div
          key={index}
          className="clickable"
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
}

export default React.memo(MapSwitcher);
