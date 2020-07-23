import React from 'react';
import {Twitter, GitHub, Database, Mail, Send} from 'react-feather';
import {useTranslation} from 'react-i18next';

function Footer() {
  const {t} = useTranslation();

  return (
    <footer>
      <div className="link">
        <a
          href="https://github.com/covid19india"
          target="_blank"
          rel="noopener noreferrer"
        >
          covid19india
        </a>
      </div>

      <h5>{t('We stand with everyone fighting on the frontlines')}</h5>

      <div className="links">
        <a
          href="https://github.com/covid19india/covid19india-react"
          className="github"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHub />
        </a>

        <a
          className="api"
          href="https://api.covid19india.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Database />
        </a>

        <a
          href="https://t.me/covid19indiaorg"
          className="telegram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Send />
        </a>

        <a
          href="https://twitter.com/covid19indiaorg"
          target="_blank"
          rel="noopener noreferrer"
          className="twitter"
        >
          <Twitter />
        </a>

        <a
          href="mailto:hello@covid19india.org"
          className="mail"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Mail />
        </a>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
