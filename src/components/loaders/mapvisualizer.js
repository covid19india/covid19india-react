import {COLORS} from '../../constants';

import React from 'react';
import ContentLoader from 'react-content-loader';

const MapVisualizerLoader = ({width, statistic}) => (
  <ContentLoader
    viewBox={`0 0 ${width} ${width}`}
    height={width}
    width={width}
    speed={2}
    backgroundColor={COLORS[statistic]}
  >
    <circle cx="150" cy={width / 2} r="5" />
    <circle cx="194" cy={width / 2} r="5" />
    <circle cx="238" cy={width / 2} r="5" />
  </ContentLoader>
);

export default MapVisualizerLoader;
