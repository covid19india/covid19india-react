import Tooltip from './Tooltip';

import {InfoIcon} from '@primer/octicons-v2-react';
import React from 'react';

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
        <h5 className="title">{title}</h5>
        <Tooltip {...{data: formula}}>
          <InfoIcon size={16} />
        </Tooltip>
      </div>
      <h4 className="statistic">{statistic}</h4>
      <h6 className="date">{date}</h6>
      {total && <h6 className="subtitle">{`India has ${total} CPM`}</h6>}
      <p className="description">{description}</p>
    </div>
  );
}

export default StateMetaCard;
