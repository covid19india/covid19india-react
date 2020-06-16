import {geoMercator} from 'd3-geo';

export const getProjection = ([width, height], topology) => {
  postMessage(geoMercator().fitSize([width, height], topology));
};
