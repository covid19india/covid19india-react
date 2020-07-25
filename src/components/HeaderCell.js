import {capitalize} from '../utils/commonFunctions';

import {FilterIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import produce from 'immer';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {createBreakpoint} from 'react-use';
import {useLongPress} from 'react-use';

const useBreakpoint = createBreakpoint({S: 768});

function StateHeaderCell({handleSort, sortData, setSortData, statistic}) {
  const breakpoint = useBreakpoint();
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
        {breakpoint === 'S'
          ? capitalize(statistic.slice(0, 1))
          : t(capitalize(statistic))}
      </div>
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
