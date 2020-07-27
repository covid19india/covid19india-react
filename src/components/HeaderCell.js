import Tooltip from './Tooltip';

import {STATISTIC_CONFIGS} from '../constants';
import {toTitleCase} from '../utils/commonFunctions';

import {FilterIcon, InfoIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useLongPress} from 'react-use';

function StateHeaderCell({handleSort, sortData, setSortData, statistic}) {
  const {t} = useTranslation();

  const onLongPress = () => {
    if (sortData.sortColumn === statistic) {
      setSortData(
        produce(sortData, (sortDataDraft) => {
          sortDataDraft.delta = !sortData.delta;
        })
      );
    }
  };
  const longPressEvent = useLongPress(onLongPress, {isPreventDefault: false});

  return (
    <div
      className="cell heading"
      onClick={handleSort.bind(this, statistic)}
      {...longPressEvent}
    >
      {sortData.sortColumn === statistic && (
        <div
          className={classnames('sort-icon', {
            invert: sortData.isAscending,
            [`is-${statistic}`]: sortData.delta,
          })}
        >
          <FilterIcon size={10} />
        </div>
      )}
      <div>{t(toTitleCase(STATISTIC_CONFIGS[statistic].displayName))}</div>
      {statistic === 'other' && (
        <Tooltip data={'Migrated cases or non-COVID deaths'}>
          <InfoIcon size={14} />
        </Tooltip>
      )}
    </div>
  );
}

const isStateHeaderCellEqual = (prevProps, currProps) => {
  if (!equal(prevProps.sortData, currProps.sortData)) {
    return false;
  } else {
    return true;
  }
};

export default React.memo(StateHeaderCell, isStateHeaderCellEqual);
