import {AlertIcon, ArrowRightIcon} from '@primer/octicons-react';
import {useTranslation} from 'react-i18next';

function Banner(props) {
  const {t} = useTranslation();

  return (
    <div className="Banner fadeInUp" style={{animationDelay: '0.4s'}}>
      <div className="wrapper">
        <div className="alert-icon">
          <AlertIcon size={16} />
        </div>
        <div className="content">
          {t(
            'After keeping all of you updated with Covid-19 information for the last 16 months, we will be stopping our operations from 31st October, 2021.'
          )}{' '}
        </div>
        <a
          href="https://blog.covid19india.org/2021/08/07/end"
          rel="noreferrer"
          target="_blank"
        >
          {t('Learn more')}
          <div className="arrow-right-icon">
            <ArrowRightIcon size={16} />
          </div>
        </a>
      </div>
    </div>
  );
}

export default Banner;
