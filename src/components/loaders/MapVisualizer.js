import {STATISTIC_CONFIGS, MAP_LEGEND_HEIGHT} from '../../constants';

import React from 'react';
import ContentLoader from 'react-content-loader';

// Margins as declared in CSS
export const MAP_BUFFER_MARGINS = 42;
export const INDIA_ASPECT_RATIO = 0.885;

const MapVisualizerLoader = ({width, statistic}) => {
  const windowWidth = window.innerWidth;
  // Default width for loader
  if (!width) width = windowWidth > 769 ? 480 : windowWidth;
  // From CSS
  const scalingFactor = windowWidth > 769 ? 0.9 : 1;
  const mapHeight = (scalingFactor * width) / INDIA_ASPECT_RATIO;
  const height = MAP_BUFFER_MARGINS + MAP_LEGEND_HEIGHT + mapHeight;
  return (
    <ContentLoader
      viewBox={`0 0 ${width} ${height}`}
      height={height}
      width={width}
      speed={2}
      backgroundColor={STATISTIC_CONFIGS[statistic].color}
    >
      <circle cx={0.4 * width} cy={height / 2} r="5" />
      <circle cx={0.5 * width} cy={height / 2} r="5" />
      <circle cx={0.6 * width} cy={height / 2} r="5" />
    </ContentLoader>
  );
};

export default MapVisualizerLoader;
