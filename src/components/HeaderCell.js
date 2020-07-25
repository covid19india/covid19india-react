import {capitalize} from '../utils/commonFunctions';

import {FilterIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useLongPress} from 'react-use';

function StateHeaderCell({
  handleSort,
  sortData,
  setSortData,
  statistic,
  expandTable,
}) {
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
      title={capitalize(statistic)}
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
      <div>
        {expandTable
          ? t(capitalize(statistic))
          : capitalize(statistic.slice(0, 1))}
      </div>
    </div>
  );
}

const isStateHeaderCellEqual = (prevProps, currProps) => {
  if (!equal(prevProps.sortData, currProps.sortData)) {
    return false;
  } else if (!equal(prevProps.expandTable, currProps.expandTable)) {
    return false;
  } else {
    return true;
  }
};

export default React.memo(StateHeaderCell, isStateHeaderCellEqual);
