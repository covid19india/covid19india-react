import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import axios from 'axios';

import Patients from './patients';
import DownloadBlock from './downloadblock';

function PatientDB(props) {
  const [fetched, setFetched] = useState(false);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const {pathname} = useLocation();
  const [filters, setFilters] = useState({
    state: '',
    dateFrom: '',
    dateTo: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    async function fetchRawData() {
      const response = await axios.get(
        'https://api.covid19india.org/raw_data.json'
      );
      if (response.data) {
        setPatients(response.data.raw_data.filter((p) => p.detectedstate));
        setFetched(true);
      } else {
        setError("Couldn't fetch patient data. Try again after sometime.");
        console.log(response);
      }
    }

    if (!fetched) {
      fetchRawData();
    }
  }, [fetched, patients]);

  const handleFilters = (filterLabel, value) => {
    filters[filterLabel] = value;
    setFilters(filters);
  };

  return (
    <div className="PatientsDB">
      {error ? <div className="alert alert-danger">{error}</div> : ''}

      <div className="header fadeInUp" style={{animationDelay: '0.3s'}}>
        <h1>Patients Database</h1>
        <h3>No. of Patients: {patients.length}</h3>
      </div>

      <div className="filters">
        <select
          className="fadeInUp"
          style={{animationDelay: '0.3s'}}
          onChange={(event) => {
            handleFilters('state', event.target.value);
          }}
        >
          {Array.from(new Set(patients.map((p) => p.detectedstate))).map(
            (state, index) => {
              return (
                <option key={index} value={state}>
                  {state}
                </option>
              );
            }
          )}
        </select>

        <select className="fadeInUp" style={{animationDelay: '0.4s'}}>
          {Array.from(new Set(patients.map((p) => p.dateannounced))).map(
            (date, index) => {
              return (
                <option key={index} value={date}>
                  {date}
                </option>
              );
            }
          )}
        </select>

        <select className="fadeInUp" style={{animationDelay: '0.5s'}}>
          {Array.from(new Set(patients.map((p) => p.dateannounced))).map(
            (date, index) => {
              return (
                <option key={index} value={date}>
                  {date}
                </option>
              );
            }
          )}
        </select>
      </div>

      <Patients patients={patients} />
      <DownloadBlock patients={patients} />
    </div>
  );
}

export default PatientDB;
