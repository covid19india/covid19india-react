import {AlertIcon, ArrowRightIcon} from '@primer/octicons-react';
import {useTranslation} from 'react-i18next';

function Banner(props) {
  const {t} = useTranslation();

  return (
    <div className="Banner fadeInDown" style={{animationDelay: '0.4s'}}>
      <div className="wrapper">
        <div className="alert-icon">
          <AlertIcon size={16} />
        </div>
        <div className="content">
          {t(
            'After 18 months of daily updates, we stopped our operations on 31st October, 2021. You can only view data from January 2020 to October 2021 on this website.'
          )}{' '}
        </div>
        <a
          href="https://blog.covid19india.org/2021/08/07/end"
          rel="noreferrer"
          target="_blank"
        >
          {t('Read more')}
          <div className="arrow-right-icon">
            <ArrowRightIcon size={16} />
          </div>
        </a>
      </div>
    </div>
  );
}

export default Banner;
