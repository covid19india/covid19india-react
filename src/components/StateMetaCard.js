import Tooltip from './Tooltip';

import {InfoIcon} from '@primer/octicons-react';
import {useTranslation} from 'react-i18next';

function StateMetaCard({
  title,
  statistic,
  total,
  formula,
  date,
  description,
  className,
}) {
  const {t} = useTranslation();

  return (
    <div className={`meta-item ${className}`}>
      <div className="meta-item-top">
        <h3>{title}</h3>
        <Tooltip {...{data: formula}}>
          <InfoIcon size={16} />
        </Tooltip>
      </div>
      <h1>{statistic}</h1>
      <h5>{date}</h5>
      {total && <h5>{`${t('India has')} ${total} ${t('CPM')}`}</h5>}
      <p>{description}</p>
    </div>
  );
}

export default StateMetaCard;
