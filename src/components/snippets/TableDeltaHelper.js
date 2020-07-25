import {TABLE_STATISTICS} from '../../constants';

import {FilterIcon} from '@primer/octicons-v2-react';
import classnames from 'classnames';
import React, {useEffect, useState} from 'react';

const TableDeltaHelper = () => {
  const [statisticIndex, setStatisticIndex] = useState(0);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setStatisticIndex((prevStatisticIndex) =>
        prevStatisticIndex === TABLE_STATISTICS.length - 1
          ? 0
          : prevStatisticIndex + 1
      );
      window.clearTimeout(id);
    }, 1000);
  }, [statisticIndex]);

  const statistic = TABLE_STATISTICS[statisticIndex].toLowerCase();

  return (
    <React.Fragment>
      <span className={classnames(`is-${statistic}`)}>
        <FilterIcon size={14} />
      </span>
      <p>Sort by Delta [long press]</p>
    </React.Fragment>
  );
};

export default TableDeltaHelper;
