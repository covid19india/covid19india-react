import {geoMercator, geoPath} from 'd3-geo';

export const getProjection = (width, height, topology) => {
  postMessage(geoPath(geoMercator().fitSize([width, height], topology)));
};
