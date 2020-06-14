import StateDropdown from './StateDropdown';

import {formatDate, formatNumber} from '../utils/commonFunctions';

import React from 'react';
import {useTranslation} from 'react-i18next';

function StateHeader({data, stateCode}) {
  const {t} = useTranslation();

  return (
    <div className="StateHeader">
      <div className="header-left">
        <StateDropdown {...{stateCode}} hyperlink={false} />
        <h5>{`Last Updated on ${formatDate(
          data.meta.last_updated,
          'dd MMM, p'
        )} IST`}</h5>
      </div>

      <div className="header-right">
        <h5>{t('Tested')}</h5>
        {data?.total?.tested && (
          <React.Fragment>
            <h2>{formatNumber(data.total.tested)}</h2>
            <h5 className="timestamp">
              {`As of ${formatDate(data.meta.tested.last_updated, 'dd MMMM')}`}
            </h5>
            <h5>
              {'per '}
              <a href={data.meta.tested.source} target="_noblank">
                source
              </a>
            </h5>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default React.memo(StateHeader);
