import {capitalize} from '../utils/commonFunctions';

import {FilterIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import equal from 'fast-deep-equal';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {createBreakpoint} from 'react-use';

const useBreakpoint = createBreakpoint({S: 768});

function PureStateHeaderCell({handleSort, sortData, statistic}) {
  const breakpoint = useBreakpoint();
  const {t} = useTranslation();

  return (
    <div className="cell heading" onClick={() => handleSort(statistic)}>
      {sortData.sortColumn === statistic && (
        <div
          className={classnames('sort-icon', {
            invert: sortData.isAscending,
          })}
        >
          <FilterIcon size={10} />
        </div>
      )}
      <div
        className={classnames({
          [`is-${statistic}`]: breakpoint === 'S',
        })}
        title={capitalize(statistic)}
      >
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

export default React.memo(PureStateHeaderCell, isStateHeaderCellEqual);
