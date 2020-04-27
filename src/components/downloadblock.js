import React from 'react';
import * as Icon from 'react-feather';

function DownloadBlock(props) {
  return (
    <div className="DownloadBlock fadeInUp" style={{animationDelay: '0.5s'}}>
      <a
        className="button"
        target="_noblank"
        href="https://raw.githubusercontent.com/covid19india/api/gh-pages/raw_data.json"
      >
        <Icon.Download /> <span>JSON</span>
      </a>
      <a
        className="button"
        target="_noblank"
        href="https://raw.githubusercontent.com/covid19india/api/gh-pages/csv/latest/raw_data.csv"
      >
        <Icon.Download /> <span>CSV</span>
      </a>
    </div>
  );
}

export default React.memo(DownloadBlock, () => {
  return true;
});
