import '../styles/footer.scss';

import React from 'react';
import {Twitter, GitHub, Database, Mail, Send} from 'react-feather';

function Footer() {
  return (
    <footer>
      <a
        data-tooltip="GitHub"
        href="https://github.com/covid19india/covid19india-react"
        className="github"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHub />
      </a>

      <a
        data-tooltip="API"
        className="api"
        href="https://api.covid19india.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Database />
      </a>

      <a
        data-tooltip="Telegram"
        href="https://t.me/covid19indiaorg"
        className="telegram"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Send />
      </a>

      <a
        data-tooltip="Twitter"
        href="https://twitter.com/covid19indiaorg"
        target="_blank"
        rel="noopener noreferrer"
        className="twitter"
      >
        <Twitter />
      </a>

      <a
        data-tooltip="Mail"
        href="mailto:hello@covid19india.org"
        className="mail"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Mail />
      </a>
    </footer>
  );
}

export default React.memo(Footer);
