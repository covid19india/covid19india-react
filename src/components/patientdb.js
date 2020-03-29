import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientTable from './patient_table';
import DownloadBlock from './downloadblock';
import './bootstrap-grid.min.css';
import './patientdb.scss';

function PatientDB(props) {
  const [fetched, setFetched] = useState(false);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRawData() {
      const response = await axios.get('https://api.covid19india.org/raw_data.json');
      if (response.data) {
        setPatients(response.data.raw_data.filter(p => p.detectedstate));
        setFetched(true);
      } else {
        setError("Couldn't fetch patient data. Try again after sometime.");
        console.log(response);
      }
    }

    if (!fetched) {
      fetchRawData();
    }
  }, [fetched]);

  return (
    <div className="container">
      {
        error ? <div className="alert alert-danger">{error}</div> : ''
      }
      <PatientTable patients={patients} />
      <DownloadBlock patients={patients} />
    </div>
  );

}

export default PatientDB;