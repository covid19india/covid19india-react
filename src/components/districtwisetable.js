import React, { useState, useEffect } from "react";
import * as Icon from "react-feather";

import Row from "./row";
import DistrictRow from "./districtrow";

function DistrictWiseTable(props) {
  const [states, setStates] = useState(props.state);
  const [state, setState] = useState(props.states[1]);
  const [district, setDistrict] = useState(props.district);
  const [index, setIndex] = useState(1);
  
  useEffect(() => {
    setStates(props.states);
    if (props.states !== undefined && props.states.length > 1) {
      setState(props.states[1].state);
    }
  }, [props.states]);

  useEffect(() => {
    if (props.stateHighlighted !== undefined) {
      setState(props.stateHighlighted.state);
      setIndex(props.stateHighlighted.index);
    }
  }, [props.stateHighlighted]);

  useEffect(() => {
    setDistrict(props.district);
  }, [props.district]);

  const parseDistrict = () => {
    const dist = props.district;
    const distArr = [];
    if (state !== undefined && dist[state] !== undefined && dist[state]["districtData"] !== undefined) {
      Object.keys(dist[state]["districtData"]).forEach(function (key) {
        distArr.push([key, dist[state]["districtData"][key]]);
      });
    }
    return distArr;
  };

  return (
    <table className="table fadeInUp" style={{ animationDelay: "1s" }}>
      <h5 className="affected-count">
        {" "}
        {state !== undefined ? state : ""} / {parseDistrict().length} districts Affected
      </h5>
      <thead>
        <tr>
          <th className="state-heading">
            <div className="heading-content">
              <abbr title="State">District / City</abbr>
            </div>
          </th>
          <th>
            <div className="heading-content">
              <abbr className={`${window.innerWidth <= 769 ? "is-cherry" : ""}`} title="Confirmed">
                {window.innerWidth <= 769 ? (window.innerWidth <= 375 ? "C" : "Cnfmd") : "Confirmed"}
              </abbr>
            </div>
          </th>
          <th>
            <div className="heading-content">
              <abbr className={`${window.innerWidth <= 769 ? "is-blue" : ""}`} title="Active">
                {window.innerWidth <= 769 ? (window.innerWidth <= 375 ? "A" : "Actv") : "Active"}
              </abbr>
            </div>
          </th>
          <th>
            <div className="heading-content">
              <abbr className={`${window.innerWidth <= 769 ? "is-green" : ""}`} title="Recovered">
                {window.innerWidth <= 769 ? (window.innerWidth <= 375 ? "R" : "Rcvrd") : "Recovered"}
              </abbr>
            </div>
          </th>
          <th>
            <div className="heading-content">
              <abbr className={`${window.innerWidth <= 769 ? "is-gray" : ""}`} title="Deaths">
                {window.innerWidth <= 769 ? (window.innerWidth <= 375 ? "D" : "Dcsd") : "Deaths"}
              </abbr>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {parseDistrict().map((district, index) => {
          return <DistrictRow key={index} index={index} district={district} total={false} onHighlightState={props.onHighlightState} />;
        })}
      </tbody>
    </table>
  );
}

export default DistrictWiseTable;
