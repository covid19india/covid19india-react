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
            'After keeping you updated with Covid-19 information for the last 18 months, we will be stopping our operations on 31st October, 2021.'
          )}{' '}
        </div>
        <a
          href="https://blog.covid19india.org/2021/08/07/end"
          rel="noreferrer"
          target="_blank"
        >
          {t('Read the full blog post')}
          <div className="arrow-right-icon">
            <ArrowRightIcon size={16} />
          </div>
        </a>
      </div>
    </div>
  );
}

export default Banner;
