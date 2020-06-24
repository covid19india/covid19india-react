import MapLegend from './MapLegend';

import {
  COLORS,
  D3_TRANSITION_DURATION,
  MAP_META,
  MAP_TYPES,
  MAP_OPTIONS,
  MAP_VIEWS,
  STATE_CODES,
  STATE_NAMES,
  STATE_POPULATIONS_MIL,
  UNKNOWN_DISTRICT_KEY,
} from '../constants';
import {
  capitalizeAll,
  formatNumber,
  getStatistic,
} from '../utils/commonFunctions';

import classnames from 'classnames';
import {max} from 'd3-array';
import {json} from 'd3-fetch';
import {geoIdentity, geoPath} from 'd3-geo';
import {scaleSqrt, scaleSequential} from 'd3-scale';
// eslint-disable-next-line
// import worker from 'workerize-loader!../workers/mapVisualizer';
import {
  interpolateReds,
  interpolateBlues,
  interpolateGreens,
  interpolateGreys,
  interpolatePurples,
} from 'd3-scale-chromatic';
import {select, event} from 'd3-selection';
import {transition} from 'd3-transition';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import * as Icon from 'react-feather';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import useSWR from 'swr';
import * as topojson from 'topojson';
import 'requestidlecallback';

const [width, height] = [432, 488];

const colorInterpolator = {
  confirmed: (t) => interpolateReds(t * 0.85),
  active: (t) => interpolateBlues(t * 0.85),
  recovered: (t) => interpolateGreens(t * 0.85),
  deceased: (t) => interpolateGreys(t * 0.85),
  tested: (t) => interpolatePurples(t * 0.85),
};

const getTotalStatistic = (data, statistic, normalizer = 1) => {
  return getStatistic(data, 'total', statistic, normalizer);
};

function MapVisualizer({
  currentMap,
  data,
  changeMap,
  regionHighlighted,
  setRegionHighlighted,
  statistic,
  isCountryLoaded,
}) {
  const {t} = useTranslation();
  const svgRef = useRef(null);

  const mapMeta = MAP_META[currentMap.code];
  const history = useHistory();

  const {data: geoData} = useSWR(
    mapMeta.geoDataFile,
    async (file) => {
      return await json(file);
    },
    {suspense: false, revalidateOnFocus: false}
  );

  const statisticMax = useMemo(() => {
    const stateCodes = Object.keys(data).filter(
      (stateCode) =>
        stateCode !== 'TT' && Object.keys(MAP_META).includes(stateCode)
    );

    return currentMap.view === MAP_VIEWS.STATES
      ? max(stateCodes, (stateCode) =>
          getTotalStatistic(
            data[stateCode],
            statistic,
            currentMap.option === MAP_OPTIONS.PER_MILLION
              ? STATE_POPULATIONS_MIL[stateCode]
              : 1
          )
        )
      : max(stateCodes, (stateCode) =>
          data[stateCode]?.districts
            ? max(Object.values(data[stateCode].districts), (districtData) =>
                getTotalStatistic(districtData, statistic)
              )
            : 0
        );
  }, [data, currentMap.option, currentMap.view, statistic]);

  const statisticTotal = useMemo(() => {
    return getTotalStatistic(
      data[currentMap.code],
      statistic,
      currentMap.option === MAP_OPTIONS.PER_MILLION
        ? STATE_POPULATIONS_MIL[currentMap.code]
        : 1
    );
  }, [data, currentMap.code, currentMap.option, statistic]);

  const mapScale = useMemo(() => {
    if (currentMap.option === MAP_OPTIONS.HOTSPOTS) {
      return scaleSqrt([0, Math.max(statisticMax, 1)], [0, 40])
        .clamp(true)
        .nice(3);
    } else {
      return scaleSequential(
        [0, Math.max(1, statisticMax)],
        colorInterpolator[statistic]
      ).clamp(true);
    }
  }, [currentMap.option, statistic, statisticMax]);

  const path = useMemo(() => {
    if (!geoData) return null;
    return geoPath(geoIdentity());
  }, [geoData]);

  const fillColor = useCallback(
    (d) => {
      const stateCode = STATE_CODES[d.properties.st_nm];
      const district = d.properties.district;
      const stateData = data[stateCode];
      const districtData = stateData?.districts?.[district];
      let n;
      if (currentMap.option === MAP_OPTIONS.ZONES) {
        n = districtData?.zone || 0;
      } else {
        if (district) n = getTotalStatistic(districtData, statistic);
        else
          n = getTotalStatistic(
            stateData,
            statistic,
            currentMap.option === MAP_OPTIONS.PER_MILLION
              ? STATE_POPULATIONS_MIL[stateCode]
              : 1
          );
      }
      const color = n === 0 ? '#ffffff00' : mapScale(n);
      return color;
    },
    [currentMap.option, data, mapScale, statistic]
  );

  const strokeColor = useCallback(() => {
    return COLORS[statistic];
  }, [statistic]);

  const features = useMemo(() => {
    if (!geoData) return null;
    const featuresWrap =
      currentMap.view === MAP_VIEWS.STATES
        ? topojson.feature(geoData, geoData.objects.states).features
        : mapMeta.mapType === MAP_TYPES.COUNTRY &&
          currentMap.option === MAP_OPTIONS.HOTSPOTS
        ? [
            ...topojson.feature(geoData, geoData.objects.states).features,
            ...topojson.feature(geoData, geoData.objects.districts).features,
          ]
        : topojson.feature(geoData, geoData.objects.districts).features;

    // Add id to each feature
    return featuresWrap.map((feature) => {
      const district = feature.properties.district;
      const state = feature.properties.st_nm;
      const obj = Object.assign({}, feature);
      obj.id = `${currentMap.code}-${state}${district ? '-' + district : ''}`;
      return obj;
    });
  }, [geoData, currentMap.code, currentMap.view, currentMap.option, mapMeta]);

  const populateTexts = useCallback(
    (regionSelection) => {
      regionSelection.select('title').text((d) => {
        if (currentMap.option === MAP_OPTIONS.TOTAL) {
          const state = d.properties.st_nm;
          const stateCode = STATE_CODES[state];
          const district = d.properties.district;

          const stateData = data[stateCode];
          const districtData = stateData?.districts?.[district];
          let n;
          if (district) n = getTotalStatistic(districtData, statistic);
          else n = getTotalStatistic(stateData, statistic);
          return (
            formatNumber(100 * (n / (statisticTotal || 0.001))) +
            '% from ' +
            capitalizeAll(district ? district : state)
          );
        }
      });
    },
    [currentMap.option, data, statistic, statisticTotal]
  );

  // Choropleth
  useEffect(() => {
    if (!geoData) return;
    const svg = select(svgRef.current);
    const T = transition().duration(D3_TRANSITION_DURATION);

    window.requestIdleCallback(() => {
      const regionSelection = svg
        .select('.regions')
        .selectAll('path')
        .data(
          currentMap.option !== MAP_OPTIONS.HOTSPOTS ? features : [],
          (d) => d.id
        )
        .join(
          (enter) =>
            enter
              .append('path')
              .attr('d', path)
              .attr('stroke-width', 1.8)
              .attr('stroke-opacity', 0)
              .style('cursor', 'pointer')
              .on('mouseenter', (d) => {
                setRegionHighlighted({
                  stateCode: STATE_CODES[d.properties.st_nm],
                  districtName: d.properties.district,
                });
              })
              .attr('fill', '#fff0')
              .attr('stroke', '#fff0')
              .call((enter) => {
                enter.append('title');
              }),
          (update) => update,
          (exit) =>
            exit
              .transition(T)
              .attr('stroke', '#fff0')
              .attr('fill', '#fff0')
              .remove()
        )
        .attr('pointer-events', 'all')
        .on('click', (d) => {
          event.stopPropagation();
          const stateCode = STATE_CODES[d.properties.st_nm];
          if (
            mapMeta.mapType === MAP_TYPES.STATE ||
            !data[stateCode]?.districts
          )
            return;
          // Disable pointer events till the new map is rendered
          svg.attr('pointer-events', 'none');
          svg
            .select('.regions')
            .selectAll('path')
            .attr('pointer-events', 'none');
          // Switch map
          history.push(
            `/state/${stateCode}${
              window.innerWidth < 769 ? '#MapExplorer' : ''
            }`
          );
        })
        .call((sel) => {
          sel.transition(T).attr('fill', fillColor).attr('stroke', strokeColor);
        });
      window.requestIdleCallback(() => {
        populateTexts(regionSelection);
      });
    });
  }, [
    currentMap.code,
    currentMap.option,
    data,
    features,
    fillColor,
    geoData,
    history,
    mapMeta.mapType,
    path,
    populateTexts,
    setRegionHighlighted,
    strokeColor,
  ]);

  // Bubble
  useEffect(() => {
    if (!features) return;

    const svg = select(svgRef.current);
    const T = transition().duration(D3_TRANSITION_DURATION);

    let circlesData = [];
    if (currentMap.option === MAP_OPTIONS.HOTSPOTS) {
      circlesData = features
        .map((feature) => {
          const stateCode = STATE_CODES[feature.properties.st_nm];
          const districtName = feature.properties.district;
          const stateData = data[stateCode];

          if (currentMap.view === MAP_VIEWS.STATES) {
            feature.value = getTotalStatistic(stateData, statistic);
          } else if (currentMap.view === MAP_VIEWS.DISTRICTS) {
            const districtData = stateData?.districts?.[districtName];

            if (districtName)
              feature.value = getTotalStatistic(districtData, statistic);
            else
              feature.value = getTotalStatistic(
                stateData?.districts?.[UNKNOWN_DISTRICT_KEY],
                statistic
              );
          }

          return feature;
        })
        .sort((featureA, featureB) => featureB.value - featureB.value);
    }

    window.requestIdleCallback(() => {
      svg
        .select('.circles')
        .selectAll('circle')
        .data(circlesData, (feature) => feature.id)
        .join(
          (enter) =>
            enter
              .append('circle')
              .attr(
                'transform',
                (feature) => `translate(${path.centroid(feature)})`
              )
              .attr('fill-opacity', 0.5)
              .style('cursor', 'pointer')
              .attr('pointer-events', 'all')
              .on('mouseenter', (feature) => {
                setRegionHighlighted({
                  stateCode: STATE_CODES[feature.properties.st_nm],
                  districtName:
                    currentMap.view === MAP_VIEWS.STATES
                      ? null
                      : feature.properties.district || UNKNOWN_DISTRICT_KEY,
                });
              })
              .on('click', (feature) => {
                history.push(
                  `/state/${STATE_CODES[feature.properties.st_nm]}${
                    window.innerWidth < 769 ? '#MapExplorer' : ''
                  }`
                );
              }),
          (update) => update,
          (exit) =>
            exit.call((exit) => exit.transition(T).attr('r', 0).remove())
        )
        .transition(T)
        .attr('fill', COLORS[statistic] + '70')
        .attr('stroke', COLORS[statistic] + '70')
        .attr('r', (feature) => mapScale(feature.value));
    });
  }, [
    currentMap.option,
    currentMap.view,
    data,
    features,
    history,
    mapScale,
    path,
    setRegionHighlighted,
    statistic,
  ]);

  // Boundaries
  useEffect(() => {
    if (!geoData) return;
    const svg = select(svgRef.current);
    const T = transition().duration(D3_TRANSITION_DURATION);

    let meshStates = [];
    let meshDistricts = [];

    if (mapMeta.mapType === MAP_TYPES.COUNTRY) {
      meshStates = [topojson.mesh(geoData, geoData.objects.states)];
      meshStates[0].id = `${currentMap.code}-states`;
    }

    if (currentMap.view === MAP_VIEWS.DISTRICTS) {
      // Add id to mesh
      meshDistricts = [topojson.mesh(geoData, geoData.objects.districts)];
      meshDistricts[0].id = `${currentMap.code}-districts`;
    }

    svg
      .select(
        currentMap.view === MAP_VIEWS.STATES
          ? '.state-borders'
          : '.district-borders'
      )
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(
        currentMap.view === MAP_VIEWS.STATES ? meshStates : meshDistricts,
        (d) => d.id
      )
      .join((enter) => enter.append('path').attr('d', path))
      .transition(T)
      .attr('stroke', () => {
        return COLORS[statistic] + '30';
      });
  }, [
    geoData,
    mapMeta,
    currentMap.code,
    currentMap.option,
    currentMap.view,
    statistic,
    path,
  ]);

  // Highlight
  useEffect(() => {
    const stateName = STATE_NAMES[regionHighlighted.stateCode];
    const district = regionHighlighted.districtName;

    const svg = select(svgRef.current);

    if (currentMap.option === MAP_OPTIONS.HOTSPOTS) {
      svg
        .select('.circles')
        .selectAll('circle')
        .attr('fill-opacity', (d) => {
          const highlighted =
            stateName === d.properties.st_nm &&
            (!district ||
              district === d.properties?.district ||
              (district === UNKNOWN_DISTRICT_KEY && !d.properties.district));
          return highlighted ? 1 : 0.5;
        });
    } else {
      svg
        .select('.regions')
        .selectAll('path')
        .each(function (d) {
          const highlighted =
            stateName === d.properties.st_nm &&
            (currentMap.view === MAP_VIEWS.STATES ||
              district === d.properties?.district);
          if (highlighted) this.parentNode.appendChild(this);
          select(this).attr('stroke-opacity', highlighted ? 1 : 0);
        });
    }
  }, [
    geoData,
    data,
    currentMap.option,
    currentMap.view,
    regionHighlighted.stateCode,
    regionHighlighted.districtName,
    statistic,
  ]);

  return (
    <React.Fragment>
      <div className="svg-parent">
        <svg
          id="chart"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          ref={svgRef}
        >
          <g className="regions" />
          <g className="state-borders" />
          {currentMap.view === MAP_VIEWS.DISTRICTS && (
            <g className="district-borders" />
          )}
          <g className="circles" />
        </svg>
        {mapMeta.mapType === MAP_TYPES.STATE &&
          !!getTotalStatistic(
            data[currentMap.code]?.districts?.[UNKNOWN_DISTRICT_KEY],
            statistic
          ) && (
            <div className={classnames('disclaimer', `is-${statistic}`)}>
              <Icon.AlertCircle />
              <span>
                {t('District-wise {{statistic}} numbers need reconciliation', {
                  statistic: t(statistic),
                })}
              </span>
            </div>
          )}
      </div>

      {mapScale && (
        <MapLegend
          mapOption={currentMap.option}
          {...{data, mapScale, statistic}}
        />
      )}

      <svg style={{position: 'absolute', height: 0}}>
        <defs>
          <filter id="balance-color" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.91372549  0           0            0  0.08627451
                      0           0.91372549  0            0  0.08627451
                      0           0           0.854901961  0  0.145098039
                      0           0           0            1  0"
            />
          </filter>
        </defs>
      </svg>
    </React.Fragment>
  );
}

export default MapVisualizer;
