import React from 'react';
import {Link} from 'react-router-dom';

function State(props) {
  return (
    <div className="State">
      <div className="state-left">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="state/Karnataka">Karnataka</Link>
        </div>
        <div className="header">
          <div className="header-left">
            <h1>Karnataka</h1>
            <h5>11 Apr, 04:32 IST</h5>
          </div>
          <div className="header-right">
            <h5>Tested</h5>
            <h2>30,000</h2>
            <h5>As of 12 April</h5>
            <h5>
              per <a href="https://google.com">state bulletin</a>
            </h5>
          </div>
        </div>
      </div>
      <div className="state-right"></div>
    </div>
  );
}

export default State;
