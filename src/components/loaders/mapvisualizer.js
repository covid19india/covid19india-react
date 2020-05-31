import {COLORS, INDIA_ASPECT_RATIO} from '../../constants';

import React from 'react';
import ContentLoader from 'react-content-loader';

const MapVisualizerLoader = ({width, statistic}) => {
  const height = width / INDIA_ASPECT_RATIO;
  return (
    <ContentLoader
      viewBox={`0 0 ${width} ${height}`}
      height={height}
      width={width}
      speed={2}
      backgroundColor={COLORS[statistic]}
    >
      <circle cx={0.4*width} cy={height / 2} r="5" />
      <circle cx={0.5*width} cy={height / 2} r="5" />
      <circle cx={0.6*width} cy={height / 2} r="5" />
    </ContentLoader>
  );
}

export default MapVisualizerLoader;
