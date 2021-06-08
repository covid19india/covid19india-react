import {TABLE_STATISTICS} from '../../constants';

import {SortDescIcon} from '@primer/octicons-react';
import classnames from 'classnames';
import {useEffect, useState} from 'react';

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

  return (
    <>
      <div className={classnames(`is-${TABLE_STATISTICS[statisticIndex]}`)}>
        <SortDescIcon size={14} />
      </div>
      <p>Sorted by Delta [Long press]</p>
    </>
  );
};

export default TableDeltaHelper;
