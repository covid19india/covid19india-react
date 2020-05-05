import React from 'react';
import {useTranslation} from 'react-i18next';

function Links(props) {
  const {t} = useTranslation();

  return (
    <div className="Links">
      <div className="link fadeInUp" style={{animationDelay: '0.2s'}}>
        <h3>{t('HELPLINE NUMBERS (by State)')}</h3>
        <a href="https://www.mohfw.gov.in/pdf/coronvavirushelplinenumber.pdf">
          https://www.mohfw.gov.in/pdf/coronvavirushelplinenumber.pdf
        </a>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.3s'}}>
        <h3>
          {t('Ministry of Health and Family Welfare, Goverment of India')}
        </h3>
        <a href="https://www.mohfw.gov.in/">https://www.mohfw.gov.in/</a>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.4s'}}>
        <h3>{t('WHO COVID-19 Home Page')}</h3>
        <a href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019">
          https://www.who.int/emergencies/diseases/novel-coronavirus-2019
        </a>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.5s'}}>
        <h3>{t('CDC')}</h3>
        <a href="https://www.cdc.gov/coronavirus/2019-ncov/faq.html">
          https://www.cdc.gov/coronavirus/2019-ncov/faq.html
        </a>
      </div>

      <div className="link fadeInUp" style={{animationDelay: '0.6s'}}>
        <h3>{t('COVID-19 Global Tracker')}</h3>
        <a href="https://coronavirus.thebaselab.com/">
          https://coronavirus.thebaselab.com/
        </a>
      </div>
    </div>
  );
}

export default Links;
