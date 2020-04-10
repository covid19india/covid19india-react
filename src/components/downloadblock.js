import React from 'react';
import {Parser} from 'json2csv';
import * as Icon from 'react-feather';

function CSVDownloadLink(props) {
  if (!props.patients) {
    return '';
  }
  try {
    const parser = new Parser(Object.keys(props.patients[0]));
    const csv = parser.parse(props.patients);
    const data = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    return (
      <a href={data} download="patients.csv">
        <code>CSV</code>
      </a>
    );
  } catch (e) {
    console.log(e);
    return (
      <a href="/">
        <code>CSV</code>
      </a>
    );
  }
}

function DownloadBlock(props) {
  if (!props.patients) {
    return '';
  }

  const dataJSON =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(props.patients));

  return (
    <div className="DownloadBlock fadeInUp" style={{animationDelay: '0.5s'}}>
      <button className="button">
        <Icon.Download />
        <CSVDownloadLink patients={props.patients} />
      </button>
      <button className="button">
        <Icon.Download />
        <a href={dataJSON} download="patients.json">
          JSON
        </a>
      </button>
    </div>
  );
}

export default DownloadBlock;
