import MapLegend from './MapLegend';

import {
  D3_TRANSITION_DURATION,
  MAP_DIMENSIONS,
  MAP_META,
  MAP_TYPES,
  MAP_VIZS,
  STATE_CODES,
  STATE_NAMES,
  STATISTIC_CONFIGS,
  UNKNOWN_DISTRICT_KEY,
} from '../constants';
import {formatNumber, spike, toTitleCase} from '../utils/commonFunctions';

import {AlertIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import {max} from 'd3-array';
import {json} from 'd3-fetch';
import {geoIdentity, geoPath} from 'd3-geo';
import {scaleLinear, scaleSqrt, scaleSequential} from 'd3-scale';
import {
  interpolateReds,
  interpolateBlues,
  interpolateGreens,
  interpolateGreys,
  interpolatePurples,
  interpolateOranges,
  interpolatePiYG,
} from 'd3-scale-chromatic';
import {select} from 'd3-selection';
import {transition} from 'd3-transition';
import {useCallback, useEffect, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router-dom';
import useSWR from 'swr';
import {feature, mesh} from 'topojson-client';

const colorInterpolator = (statistic) => {
  if (statistic === 'confirmed') {
    return (t) => interpolateReds(t * 0.85);
  } else if (statistic === 'active') {
    return (t) => interpolateBlues(t * 0.85);
  } else if (statistic === 'recovered') {
    return (t) => interpolateGreens(t * 0.85);
  } else if (statistic === 'deceased') {
    return (t) => interpolateGreys(t * 0.85);
  } else if (statistic === 'tested') {
    return (t) => interpolatePurples(t * 0.85);
  } else if (
    statistic === 'tpr' ||
    statistic === 'cfr' ||
    statistic === 'other'
  ) {
    return (t) => interpolateOranges(t * 0.85);
  } else if (STATISTIC_CONFIGS[statistic]?.category === 'vaccinated') {
    return (t) => interpolatePiYG(0.15 + 0.35 * (1 - t));
  } else {
    return (t) => interpolateOranges(t * 0.85);
  }
};

function MapVisualizer({
  mapCode,
  isDistrictView,
  mapViz,
  data,
  regionHighlighted,
  setRegionHighlighted,
  statistic,
  getMapStatistic,
  transformStatistic,
  noDistrictData,
}) {
  const {t} = useTranslation();
  const svgRef = useRef(null);

  const mapMeta = MAP_META[mapCode];
  const history = useHistory();

  const {data: geoData} = useSWR(
    mapMeta.geoDataFile,
    async (file) => {
      return await json(file);
    },
    {suspense: false, revalidateOnFocus: false}
  );

  const statisticTotal = useMemo(() => {
    return getMapStatistic(data[mapCode]);
  }, [data, mapCode, getMapStatistic]);

  const statisticConfig = STATISTIC_CONFIGS[statistic];

  const strokeColor = useCallback(
    (alpha) => (statisticConfig?.color || '#343a40') + alpha,
    [statisticConfig]
  );

  const features = useMemo(() => {
    if (!geoData) return null;

    const featuresWrap = !isDistrictView
      ? feature(geoData, geoData.objects.states).features
      : mapMeta.mapType === MAP_TYPES.COUNTRY && mapViz !== MAP_VIZS.CHOROPLETH
      ? [
          ...feature(geoData, geoData.objects.states).features,
          ...feature(geoData, geoData.objects.districts).features,
        ]
      : feature(geoData, geoData.objects.districts).features;
    // Add id to each feature
    return featuresWrap.map((feature) => {
      const district = feature.properties.district;
      const state = feature.properties.st_nm;
      const obj = Object.assign({}, feature);
      obj.id = `${mapCode}-${state}${district ? '-' + district : ''}`;
      return obj;
    });
  }, [geoData, mapCode, isDistrictView, mapViz, mapMeta]);

  const districtsSet = useMemo(() => {
    if (!geoData || !isDistrictView) return {};
    return feature(geoData, geoData.objects.districts).features.reduce(
      (stateCodes, feature) => {
        const stateCode = STATE_CODES[feature.properties.st_nm];
        if (!stateCodes[stateCode]) {
          stateCodes[stateCode] = new Set();
        }
        stateCodes[stateCode].add(feature.properties.district);
        return stateCodes;
      },
      {}
    );
  }, [geoData, isDistrictView]);

  const statisticMax = useMemo(() => {
    const stateCodes = Object.keys(data).filter(
      (stateCode) =>
        stateCode !== 'TT' && Object.keys(MAP_META).includes(stateCode)
    );

    if (!isDistrictView) {
      return max(stateCodes, (stateCode) =>
        transformStatistic(getMapStatistic(data[stateCode]))
      );
    } else {
      const districtData = stateCodes.reduce((res, stateCode) => {
        const districts = Object.keys(data[stateCode]?.districts || []).filter(
          (districtName) =>
            (districtsSet?.[stateCode] || new Set()).has(districtName) ||
            (mapViz !== MAP_VIZS.CHOROPLETH &&
              districtName === UNKNOWN_DISTRICT_KEY)
        );
        res.push(
          ...districts.map((districtName) =>
            transformStatistic(
              getMapStatistic(data[stateCode].districts[districtName])
            )
          )
        );
        return res;
      }, []);
      return max(districtData);
    }
  }, [
    data,
    isDistrictView,
    getMapStatistic,
    mapViz,
    districtsSet,
    transformStatistic,
  ]);

  const mapScale = useMemo(() => {
    if (mapViz === MAP_VIZS.BUBBLE) {
      // No negative values
      return scaleSqrt([0, Math.max(1, statisticMax || 0)], [0, 40])
        .clamp(true)
        .nice(3);
    } else if (mapViz === MAP_VIZS.SPIKE) {
      return scaleLinear([0, Math.max(1, statisticMax || 0)], [0, 80])
        .clamp(true)
        .nice(3);
    } else if (STATISTIC_CONFIGS[statistic]?.mapConfig?.colorScale) {
      return STATISTIC_CONFIGS[statistic].mapConfig.colorScale;
    } else {
      // No negative values
      return scaleSequential(
        [0, Math.max(1, statisticMax || 0)],
        colorInterpolator(statistic)
      ).clamp(true);
    }
  }, [mapViz, statistic, statisticMax]);

  const fillColor = useCallback(
    (d) => {
      if (mapViz === MAP_VIZS.CHOROPLETH) {
        const stateCode = STATE_CODES[d.properties.st_nm];
        const district = d.properties.district;
        const stateData = data[stateCode];
        const districtData = stateData?.districts?.[district];
        const n = transformStatistic(
          getMapStatistic(district ? districtData : stateData)
        );
        const color = n ? mapScale(n) : '#ffffff00';
        return color;
      }
    },
    [mapViz, data, mapScale, getMapStatistic, transformStatistic]
  );

  const populateTexts = useCallback(
    (regionSelection) => {
      regionSelection.select('title').text((d) => {
        if (mapViz !== MAP_VIZS.CHOROPLETH && !statisticConfig?.nonLinear) {
          const state = d.properties.st_nm;
          const stateCode = STATE_CODES[state];
          const district = d.properties.district;

          const stateData = data[stateCode];
          const districtData = stateData?.districts?.[district];
          let n;
          if (district) n = getMapStatistic(districtData);
          else n = getMapStatistic(stateData);
          return `${formatNumber(
            100 * (n / (statisticTotal || 0.001)),
            '%'
          )} from ${toTitleCase(district ? district : state)}`;
        }
      });
    },
    [mapViz, data, getMapStatistic, statisticTotal, statisticConfig]
  );

  const onceTouchedRegion = useRef(null);

  // Reset on tapping outside map
  useEffect(() => {
    const svg = select(svgRef.current);

    svg.attr('pointer-events', 'auto').on('click', () => {
      onceTouchedRegion.current = null;
      setRegionHighlighted({
        stateCode: mapCode,
        districtName: null,
      });
    });
  }, [mapCode, setRegionHighlighted]);

  const path = useMemo(() => {
    if (!geoData) return null;
    return geoPath(geoIdentity());
  }, [geoData]);

  // Choropleth
  useEffect(() => {
    if (!geoData) return;
    const svg = select(svgRef.current);
    const T = transition().duration(D3_TRANSITION_DURATION);

    svg
      .select('.regions')
      .selectAll('path')
      .data(mapViz === MAP_VIZS.CHOROPLETH ? features : [], (d) => d.id)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', path)
            .attr('stroke-width', 1.8)
            .attr('stroke-opacity', 0)
            .style('cursor', 'pointer')
            .on('mouseenter', (event, d) => {
              if (onceTouchedRegion.current) return;
              setRegionHighlighted({
                stateCode: STATE_CODES[d.properties.st_nm],
                districtName: d.properties.district,
              });
            })
            .on('pointerdown', (event, d) => {
              if (onceTouchedRegion.current === d)
                onceTouchedRegion.current = null;
              else onceTouchedRegion.current = d;
              setRegionHighlighted({
                stateCode: STATE_CODES[d.properties.st_nm],
                districtName: d.properties.district,
              });
            })
            .attr('fill', '#fff0')
            .attr('stroke', '#fff0'),
        (update) => update,
        (exit) =>
          exit
            .transition(T)
            .attr('stroke', '#fff0')
            .attr('fill', '#fff0')
            .remove()
      )
      .attr('pointer-events', 'all')
      .on('click', (event, d) => {
        event.stopPropagation();
        const stateCode = STATE_CODES[d.properties.st_nm];
        if (
          onceTouchedRegion.current ||
          mapMeta.mapType === MAP_TYPES.STATE ||
          !data[stateCode]?.districts
        )
          return;
        // Disable pointer events till the new map is rendered
        svg.attr('pointer-events', 'none');
        svg.select('.regions').selectAll('path').attr('pointer-events', 'none');
        // Switch map
        history.push(
          `/state/${stateCode}${window.innerWidth < 769 ? '#MapExplorer' : ''}`
        );
      })
      .call((sel) => {
        sel
          .transition(T)
          .attr('fill', fillColor)
          .attr('stroke', strokeColor.bind(this, ''));
      });
  }, [
    mapViz,
    data,
    features,
    fillColor,
    geoData,
    history,
    mapMeta.mapType,
    path,
    setRegionHighlighted,
    strokeColor,
  ]);

  const sortedFeatures = useMemo(() => {
    if (mapViz === MAP_VIZS.CHOROPLETH) {
      return [];
    } else {
      return (features || [])
        .map((feature) => {
          const stateCode = STATE_CODES[feature.properties.st_nm];
          const districtName = feature.properties.district;
          const stateData = data[stateCode];

          if (!isDistrictView) {
            feature.value = getMapStatistic(stateData);
          } else {
            const districtData = stateData?.districts?.[districtName];

            if (districtName) feature.value = getMapStatistic(districtData);
            else
              feature.value = getMapStatistic(
                stateData?.districts?.[UNKNOWN_DISTRICT_KEY]
              );
          }

          return feature;
        })
        .filter((feature) => feature.value > 0)
        .sort((featureA, featureB) => featureB.value - featureB.value);
    }
  }, [mapViz, isDistrictView, getMapStatistic, features, data]);

  // Bubble
  useEffect(() => {
    const svg = select(svgRef.current);
    const T = transition().duration(D3_TRANSITION_DURATION);

    const regionSelection = svg
      .select('.circles')
      .selectAll('circle')
      .data(
        mapViz === MAP_VIZS.BUBBLE ? sortedFeatures : [],
        (feature) => feature.id
      )
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr(
              'transform',
              (feature) => `translate(${path.centroid(feature)})`
            )
            .attr('fill-opacity', 0.25)
            .style('cursor', 'pointer')
            .attr('pointer-events', 'all')
            .call((enter) => {
              enter.append('title');
            }),
        (update) => update,
        (exit) => exit.call((exit) => exit.transition(T).attr('r', 0).remove())
      )
      .on('mouseenter', (event, feature) => {
        if (onceTouchedRegion.current) return;
        setRegionHighlighted({
          stateCode: STATE_CODES[feature.properties.st_nm],
          districtName: !isDistrictView
            ? null
            : feature.properties.district || UNKNOWN_DISTRICT_KEY,
        });
      })
      .on('pointerdown', (event, feature) => {
        if (onceTouchedRegion.current === feature)
          onceTouchedRegion.current = null;
        else onceTouchedRegion.current = feature;
        setRegionHighlighted({
          stateCode: STATE_CODES[feature.properties.st_nm],
          districtName: !isDistrictView
            ? null
            : feature.properties.district || UNKNOWN_DISTRICT_KEY,
        });
      })
      .on('click', (event, feature) => {
        event.stopPropagation();
        if (onceTouchedRegion.current || mapMeta.mapType === MAP_TYPES.STATE)
          return;
        history.push(
          `/state/${STATE_CODES[feature.properties.st_nm]}${
            window.innerWidth < 769 ? '#MapExplorer' : ''
          }`
        );
      })
      .call((sel) => {
        sel
          .transition(T)
          .attr('fill', statisticConfig.color + '70')
          .attr('stroke', statisticConfig.color + '70')
          .attr('r', (feature) => mapScale(feature.value));
      });

    window.requestIdleCallback(() => {
      populateTexts(regionSelection);
    });
  }, [
    mapMeta.mapType,
    mapViz,
    isDistrictView,
    sortedFeatures,
    history,
    mapScale,
    path,
    setRegionHighlighted,
    populateTexts,
    statisticConfig,
    getMapStatistic,
  ]);

  // Spike (Note: bad unmodular code)
  useEffect(() => {
    const svg = select(svgRef.current);
    const T = transition().duration(D3_TRANSITION_DURATION);

    const regionSelection = svg
      .select('.spikes')
      .selectAll('path')
      .data(
        mapViz === MAP_VIZS.SPIKE ? sortedFeatures : [],
        (feature) => feature.id,
        (feature) => feature.id
      )
      .join(
        (enter) =>
          enter
            .append('path')
            .attr(
              'transform',
              (feature) => `translate(${path.centroid(feature)})`
            )
            .attr('opacity', 0)
            .attr('fill-opacity', 0.25)
            .style('cursor', 'pointer')
            .attr('pointer-events', 'all')
            .attr('d', spike(0))
            .call((enter) => {
              enter.append('title');
            }),
        (update) => update,
        (exit) =>
          exit.call((exit) =>
            exit.transition(T).attr('opacity', 0).attr('d', spike(0)).remove()
          )
      )
      .on('mouseenter', (event, feature) => {
        if (onceTouchedRegion.current) return;
        setRegionHighlighted({
          stateCode: STATE_CODES[feature.properties.st_nm],
          districtName: !isDistrictView
            ? null
            : feature.properties.district || UNKNOWN_DISTRICT_KEY,
        });
      })
      .on('pointerdown', (event, feature) => {
        if (onceTouchedRegion.current === feature)
          onceTouchedRegion.current = null;
        else onceTouchedRegion.current = feature;
        setRegionHighlighted({
          stateCode: STATE_CODES[feature.properties.st_nm],
          districtName: !isDistrictView
            ? null
            : feature.properties.district || UNKNOWN_DISTRICT_KEY,
        });
      })
      .on('click', (event, feature) => {
        event.stopPropagation();
        if (onceTouchedRegion.current || mapMeta.mapType === MAP_TYPES.STATE)
          return;
        history.push(
          `/state/${STATE_CODES[feature.properties.st_nm]}${
            window.innerWidth < 769 ? '#MapExplorer' : ''
          }`
        );
      })
      .call((sel) => {
        sel
          .transition(T)
          .attr('opacity', 1)
          .attr('fill', statisticConfig.color + '70')
          .attr('stroke', statisticConfig.color + '70')
          .attr('d', (feature) => spike(mapScale(feature.value)));
      });

    window.requestIdleCallback(() => {
      populateTexts(regionSelection);
    });
  }, [
    mapMeta.mapType,
    mapViz,
    isDistrictView,
    sortedFeatures,
    history,
    mapScale,
    path,
    setRegionHighlighted,
    populateTexts,
    statisticConfig,
    getMapStatistic,
  ]);

  // Boundaries
  useEffect(() => {
    if (!geoData) return;
    const svg = select(svgRef.current);
    const T = transition().duration(D3_TRANSITION_DURATION);

    let meshStates = [];
    let meshDistricts = [];

    if (mapMeta.mapType === MAP_TYPES.COUNTRY) {
      meshStates = [mesh(geoData, geoData.objects.states)];
      meshStates[0].id = `${mapCode}-states`;
    }

    if (
      mapMeta.mapType === MAP_TYPES.STATE ||
      (isDistrictView && mapViz === MAP_VIZS.CHOROPLETH)
    ) {
      // Add id to mesh
      meshDistricts = [mesh(geoData, geoData.objects.districts)];
      meshDistricts[0].id = `${mapCode}-districts`;
    }

    svg
      .select('.state-borders')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(meshStates, (d) => d.id)
      .join(
        (enter) => enter.append('path').attr('d', path).attr('stroke', '#fff0'),
        (update) => update,
        (exit) => exit.transition(T).attr('stroke', '#fff0').remove()
      )
      .transition(T)
      .attr('stroke', strokeColor.bind(this, '40'));

    svg
      .select('.district-borders')
      .attr('fill', 'none')
      .attr('stroke-width', 1.5)
      .selectAll('path')
      .data(meshDistricts, (d) => d.id)
      .join(
        (enter) =>
          enter
            .append('path')
            .attr('d', path)
            .attr('d', path)
            .attr('stroke', '#fff0'),
        (update) => update,
        (exit) => exit.transition(T).attr('stroke', '#fff0').remove()
      )
      .transition(T)
      .attr('stroke', strokeColor.bind(this, '40'));
  }, [
    geoData,
    mapMeta,
    mapCode,
    mapViz,
    isDistrictView,
    statistic,
    path,
    strokeColor,
  ]);

  // Highlight
  useEffect(() => {
    const stateCode = regionHighlighted.stateCode;
    const stateName = STATE_NAMES[stateCode];
    const district = regionHighlighted.districtName;

    const svg = select(svgRef.current);

    if (mapViz === MAP_VIZS.BUBBLE) {
      svg
        .select('.circles')
        .selectAll('circle')
        .attr('fill-opacity', (d) => {
          const highlighted =
            stateName === d.properties.st_nm &&
            ((!district && stateCode !== mapCode) ||
              district === d.properties?.district ||
              !isDistrictView ||
              (district === UNKNOWN_DISTRICT_KEY && !d.properties.district));
          return highlighted ? 1 : 0.25;
        });
    } else if (mapViz === MAP_VIZS.SPIKE) {
      svg
        .select('.spikes')
        .selectAll('path')
        .attr('fill-opacity', (d) => {
          const highlighted =
            stateName === d.properties.st_nm &&
            ((!district && stateCode !== mapCode) ||
              district === d.properties?.district ||
              !isDistrictView ||
              (district === UNKNOWN_DISTRICT_KEY && !d.properties.district));
          return highlighted ? 1 : 0.25;
        });
    } else {
      svg
        .select('.regions')
        .selectAll('path')
        .each(function (d) {
          const highlighted =
            stateName === d.properties.st_nm &&
            ((!district && stateCode !== mapCode) ||
              district === d.properties?.district ||
              !isDistrictView);
          if (highlighted) this.parentNode.appendChild(this);
          select(this).attr('stroke-opacity', highlighted ? 1 : 0);
        });
    }
  }, [
    geoData,
    data,
    mapCode,
    isDistrictView,
    mapViz,
    regionHighlighted.stateCode,
    regionHighlighted.districtName,
    statistic,
  ]);

  return (
    <>
      <div className="svg-parent">
        <svg
          id="chart"
          className={classnames({
            zone: !!statisticConfig?.mapConfig?.colorScale,
          })}
          viewBox={`0 0 ${MAP_DIMENSIONS[0]} ${MAP_DIMENSIONS[1]}`}
          preserveAspectRatio="xMidYMid meet"
          ref={svgRef}
        >
          <g className="regions" />
          <g className="state-borders" />
          <g className="district-borders" />
          <g className="circles" />
          <g className="spikes" />
        </svg>
        {noDistrictData && statisticConfig?.hasPrimary && (
          <div className={classnames('disclaimer', `is-${statistic}`)}>
            <AlertIcon />
            <span>
              {t('District-wise data not available in state bulletin')}
            </span>
          </div>
        )}
      </div>

      {mapScale && <MapLegend {...{data, statistic, mapViz, mapScale}} />}

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
    </>
  );
}

export default MapVisualizer;
