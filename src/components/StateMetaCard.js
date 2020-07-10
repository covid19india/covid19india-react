import Tooltip from './Tooltip';

import React from 'react';
import * as Icon from 'react-feather';

function StateMetaCard({
  title,
  statistic,
  total,
  formula,
  date,
  description,
  className,
}) {
  return (
    <div className={`meta-item ${className}`}>
      <div className="meta-item-top">
        <h3>{title}</h3>
        <Tooltip {...{data: formula}}>
          <Icon.Info />
        </Tooltip>
      </div>
      <h1>{statistic}</h1>
      <h5>{date}</h5>
      {total && <h5>{`India has ${total} CPM`}</h5>}
      <p>{description}</p>
    </div>
  );
}

export default StateMetaCard;
