import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Patients from './patients';
import DownloadBlock from './downloadblock';

function PatientDB(props) {
  const [fetched, setFetched] = useState(false);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');

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
  }, [fetched]);

  return (
    <div className="PatientsDB">
      {error ? <div className="alert alert-danger">{error}</div> : ''}

      <div className="header fadeInUp" style={{animationDelay: '0.3s'}}>
        <h1>Patients Database</h1>
        <h3>No. of Patients: {patients.length}</h3>
      </div>

      <Patients patients={patients} />
      <DownloadBlock patients={patients} />
    </div>
  );
}

export default PatientDB;
