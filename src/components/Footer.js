import React from 'react';
import {Twitter, GitHub, Database, Mail, Send} from 'react-feather';
import {useTranslation} from 'react-i18next';
import ReactTooltip from 'react-tooltip';

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
          data-tip
          data-for="githubTip"
        >
          <GitHub />
          <ReactTooltip id="githubTip" place="top" effect="solid">
            Github
          </ReactTooltip>
        </a>

        <a
          className="api"
          href="https://api.covid19india.org"
          target="_blank"
          rel="noopener noreferrer"
          data-tip
          data-for="databaseTip"
        >
          <Database />
          <ReactTooltip id="databaseTip" place="top" effect="solid">
            Database
          </ReactTooltip>
        </a>

        <a
          href="https://t.me/covid19indiaorg"
          className="telegram"
          target="_blank"
          rel="noopener noreferrer"
          data-tip
          data-for="sendTip"
        >
          <Send />
          <ReactTooltip id="sendTip" place="top" effect="solid">
            Send
          </ReactTooltip>
        </a>

        <a
          href="https://twitter.com/covid19indiaorg"
          target="_blank"
          rel="noopener noreferrer"
          className="twitter"
          data-tip
          data-for="twitterTip"
        >
          <Twitter />
          <ReactTooltip id="twitterTip" place="top" effect="solid">
            Twitter
          </ReactTooltip>
        </a>

        <a
          href="mailto:hello@covid19india.org"
          className="mail"
          target="_blank"
          rel="noopener noreferrer"
          data-tip
          data-for="mailTip"
        >
          <Mail />
          <ReactTooltip id="mailTip" place="top" effect="solid" height="40px">
            Mail
          </ReactTooltip>
        </a>
      </div>
    </footer>
  );
}

export default React.memo(Footer);
