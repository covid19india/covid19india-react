import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Icon from "react-feather";

import DistrictRow from "./districtRow";

function DistrictTable(props) {
  const [districts, setDistricts] = useState([]);
  const [districtData, setDistrictData] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [currentState, setCurrentState] = useState([]);
  const [count, setCount] = useState(0);
  const [sortData, setSortData] = useState({
    sortColumn: "confirmed",
    isAscending: false
  });

  useEffect(() => {
    if (fetched === false) {
      getDistricts();
    }
  }, [fetched, props.selectedState]);

  useEffect(() => {
    setDistrictData({});
    Object.keys(districts).map(state => {
      if (state === props.selectedState) {
        setDistrictData(districts[state]["districtData"]);
      }
    });
  }, [districts, props.selectedState]);

  useEffect(() => {
    setCount(Object.keys(districtData).length);
    props.states.map(i => {
      if (i.state === props.selectedState) {
        setCurrentState(i);
      }
    });
  }, [districtData, props.selectedState]);

  const getDistricts = () => {
    axios
      .get("https://api.covid19india.org/state_district_wise.json")
      .then(response => {
        setDistricts(response.data);
        setFetched(true);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const asceSort = obj => {
    const ordered = {};
    Object.keys(obj)
      .sort()
      .forEach(key => {
        ordered[key] = obj[key];
      });
    return ordered;
  };

  const descSort = obj => {
    const ordered = {};
    Object.keys(obj)
      .sort()
      .reverse()
      .forEach(key => {
        ordered[key] = obj[key];
      });
    return ordered;
  };

  const asceValueSort = (obj, col) => {
    const ordered = {};
    Object.keys(obj)
      .sort((a, b) => {
        let value1 = parseInt(obj[a][col]);
        let value2 = parseInt(obj[b][col]);
        return value1 > value2 ? 1 : -1;
      })
      .forEach(key => {
        ordered[key] = obj[key];
      });
    console.log(ordered);
    return ordered;
  };

  const descValueSort = (obj, col) => {
    const ordered = {};
    Object.keys(obj)
      .sort((a, b) => {
        let value1 = parseInt(obj[a][col]);
        let value2 = parseInt(obj[b][col]);
        return value1 > value2 ? -1 : 1;
      })
      .forEach(key => {
        ordered[key] = obj[key];
      });
    return ordered;
  };

  const handleSort = (e, props) => {
    const currentsortColumn = e.currentTarget
      .querySelector("abbr")
      .getAttribute("title")
      .toLowerCase();
    setSortData({
      sortColumn: currentsortColumn,
      isAscending:
        sortData.sortColumn == currentsortColumn
          ? !sortData.isAscending
          : sortData.sortColumn === "state"
    });

    if (currentsortColumn !== "state") {
      sortData.isAscending
        ? setDistrictData(asceValueSort(districtData, sortData.sortColumn))
        : setDistrictData(descValueSort(districtData, sortData.sortColumn));
    }

    if (currentsortColumn === "state") {
      sortData.isAscending
        ? setDistrictData(asceSort(districtData))
        : setDistrictData(descSort(districtData));
    }
  };

  return (
    <div>
      <table className="table fadeInUp" style={{ animationDelay: "1s" }}>
        <h5 className="affected-count">{count} Districts Affected</h5>
        <thead>
          <tr>
            <th className="state-heading" onClick={e => handleSort(e, props)}>
              <div className="heading-content">
                <abbr title="State">Districts</abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === "state" ? "initial" : "none"
                  }}
                >
                  <Icon.Maximize2 />
                </div>
              </div>
            </th>
            <th onClick={e => handleSort(e, props)}>
              <div className="heading-content">
                <abbr
                  className={`${window.innerWidth <= 769 ? "is-cherry" : ""}`}
                  title="Confirmed"
                >
                  {window.innerWidth <= 769
                    ? window.innerWidth <= 375
                      ? "C"
                      : "Cnfrmd"
                    : "Confirmed"}
                </abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === "confirmed" ? "initial" : "none"
                  }}
                >
                  <Icon.Maximize2 />
                </div>
              </div>
            </th>
            <th onClick={e => handleSort(e, props)}>
              <div className="heading-content">
                <abbr
                  className={`${window.innerWidth <= 769 ? "is-blue" : ""}`}
                  title="Active"
                >
                  {window.innerWidth <= 769
                    ? window.innerWidth <= 375
                      ? "A"
                      : "Actv"
                    : "Active"}
                </abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === "active" ? "initial" : "none"
                  }}
                >
                  <Icon.Maximize2 />
                </div>
              </div>
            </th>
            <th onClick={e => handleSort(e, props)}>
              <div className="heading-content">
                <abbr
                  className={`${window.innerWidth <= 769 ? "is-green" : ""}`}
                  title="Recovered"
                >
                  {window.innerWidth <= 769
                    ? window.innerWidth <= 375
                      ? "R"
                      : "Rcvrd"
                    : "Recovered"}
                </abbr>
                <div
                  className={
                    sortData.sortColumn === "recovered" ? "sort-black" : ""
                  }
                ></div>
                <div
                  style={{
                    display:
                      sortData.sortColumn === "recovered" ? "initial" : "none"
                  }}
                >
                  <Icon.Maximize2 />
                </div>
              </div>
            </th>
            <th onClick={e => handleSort(e, props)}>
              <div className="heading-content">
                <abbr
                  className={`${window.innerWidth <= 769 ? "is-gray" : ""}`}
                  title="Deaths"
                >
                  {window.innerWidth <= 769
                    ? window.innerWidth <= 375
                      ? "D"
                      : "DCSD"
                    : "Deaths"}
                </abbr>
                <div
                  style={{
                    display:
                      sortData.sortColumn === "deaths" ? "initial" : "none"
                  }}
                >
                  <Icon.Maximize2 />
                </div>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {Object.keys(districtData).map(district => {
            districtData[district] = {
              ...districtData[district],
              state: district
            };
            return (
              <DistrictRow key={district} state={districtData[district]} />
            );
          })}

          {<DistrictRow key={0} state={currentState} total={true} />}
        </tbody>
      </table>
    </div>
  );
}

export default DistrictTable;
