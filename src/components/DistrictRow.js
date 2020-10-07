import Cell from './Cell';
import Tooltip from './Tooltip';

import {TABLE_STATISTICS, TABLE_STATISTICS_EXPANDED} from '../constants';

import {InfoIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';

function DistrictRow({
  stateCode,
  districtName,
  data,
  isPerMillion,
  regionHighlighted,
  setRegionHighlighted,
  expandTable,
  lastUpdatedTT,
}) {
  const {t} = useTranslation();

  const highlightDistrict = useCallback(() => {
    if (regionHighlighted.districtName !== districtName) {
      setRegionHighlighted(
        produce(regionHighlighted, (draftRegionHighlighted) => {
          draftRegionHighlighted.stateCode = stateCode;
          draftRegionHighlighted.districtName = districtName;
        })
      );
    }
  }, [regionHighlighted, districtName, setRegionHighlighted, stateCode]);

  const tableStatistics = expandTable
    ? TABLE_STATISTICS_EXPANDED
    : TABLE_STATISTICS;

  return (
    <div
      className={classnames('row', 'district', {
        'is-highlighted': regionHighlighted?.districtName === districtName,
      })}
      onMouseEnter={highlightDistrict}
    >
      <div className="cell">
        <div className="state-name">{t(districtName)}</div>
        {data?.meta?.notes && (
          <Tooltip {...{data: data.meta.notes}}>
            <InfoIcon size={16} />
          </Tooltip>
        )}
      </div>

      {tableStatistics.map((statistic) => (
        <Cell
          key={statistic}
          {...{statistic, data, isPerMillion, lastUpdatedTT}}
        />
      ))}
    </div>
  );
}

const isDistrictRowEqual = (prevProps, currProps) => {
  if (!equal(prevProps.data?.total, currProps.data?.total)) {
    return false;
  } else if (!equal(prevProps.data?.delta, currProps.data?.delta)) {
    return false;
  } else if (
    !equal(prevProps.data?.['last_updated'], currProps.data?.['last_updated'])
  ) {
    return false;
  } else if (!equal(prevProps.isPerMillion, currProps.isPerMillion)) {
    return false;
  } else if (
    !equal(
      prevProps.regionHighlighted.districtName,
      currProps.regionHighlighted.districtName
    ) &&
    (equal(prevProps.regionHighlighted.districtName, prevProps.districtName) ||
      equal(currProps.regionHighlighted.districtName, currProps.districtName))
  ) {
    return false;
  } else if (!equal(prevProps.expandTable, currProps.expandTable)) {
    return false;
  }
  return true;
};

export default React.memo(DistrictRow, isDistrictRowEqual);
