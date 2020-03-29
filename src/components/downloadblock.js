import React from 'react';
import { Parser } from "json2csv";

function CSVDownloadLink(props) {
  if(!props.patients) {
    return '';
  }
  try {
    const parser = new Parser({fields: Object.keys(props.patients[0]), eol: "\r\n"});
    const csv = parser.parse(props.patients);
    const data = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    return (
      <a href={data} download="patients.csv"><code>CSV</code></a>
    )
  } catch (e) {
    console.log(e);
    return '';
  }
}
function DownloadBlock(props) {
  if (!props.patients) {
    return '';
  }

  const dataJSON = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(props.patients));

  return (
    <div className="d-block my-3">
      <p className="text-right">
        <small>
          <strong>Download </strong>
          <span className="ml-2">
            <CSVDownloadLink patients={props.patients}/>
          </span>
          <span className="ml-2">
            <a href={dataJSON} download="patients.json">
              <code>JSON</code>
            </a>
          </span>
        </small>
      </p>
    </div>
  );
}

export default DownloadBlock;