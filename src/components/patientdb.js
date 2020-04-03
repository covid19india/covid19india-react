import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import axios from 'axios';

import Patients from './patients';
import DownloadBlock from './downloadblock';

function filterByObject(obj, filters) {
  const keys = Object.keys(filters);
  return obj.filter((p) => {
    return keys.every((key) => {
      if (!filters[key].length) return true;
      return p[key] === filters[key];
    });
  });
}

function PatientDB(props) {
  const [fetched, setFetched] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [error, setError] = useState('');
  const {pathname} = useLocation();
  const [filters, setFilters] = useState({
    detectedstate: '',
    detecteddistrict: '',
    detectedcity: '',
    dateannounced: '',
  });
  const [colorMode, setColorMode] = useState('genders');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    async function fetchRawData() {
      const response = await axios.get(
        'https://api.covid19india.org/raw_data.json'
      );
      if (response.data) {
        setPatients(response.data.raw_data.reverse());
        setFilteredPatients(patients);
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

  const handleFilters = (label, value) => {
    setFilters((f) => {
      // Create new object (deep copy)
      const newFilters = {...f};
      newFilters[label] = value;
      if (label === 'detectedstate') {
        newFilters['detecteddistrict'] = '';
        newFilters['detectedcity'] = '';
      } else if (label === 'detecteddistrict') {
        newFilters['detectedcity'] = '';
      }
      return newFilters;
    });
  };

  useEffect(() => {
    setFilteredPatients(filterByObject(patients, filters));
  }, [patients, filters]);

  function getSortedValues(obj, key) {
    const setValues = new Set(obj.map((p) => p[key]));
    if (setValues.size > 1) setValues.add('');
    return Array.from(setValues).sort();
  }

  return (
    <div className="PatientsDB">
      {error ? <div className="alert alert-danger">{error}</div> : ''}

      <div className="filters fadeInUp" style={{animationDelay: '0.5s'}}>
        <div className="filters-left">
          <div className="select">
            <select
              style={{animationDelay: '0.3s'}}
              onChange={(event) => {
                handleFilters('detectedstate', event.target.value);
              }}
            >
              {getSortedValues(patients, 'detectedstate').map(
                (state, index) => {
                  return (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  );
                }
              )}
            </select>
          </div>

          <div className="select">
            <select
              style={{animationDelay: '0.4s'}}
              onChange={(event) => {
                handleFilters('detecteddistrict', event.target.value);
              }}
            >
              {getSortedValues(
                filterByObject(patients, {
                  detectedstate: filters.detectedstate,
                }),
                'detecteddistrict'
              ).map((district, index) => {
                return (
                  <option key={index} value={district}>
                    {district}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="select">
            <select
              style={{animationDelay: '0.4s'}}
              onChange={(event) => {
                handleFilters('detectedcity', event.target.value);
              }}
            >
              {getSortedValues(
                filterByObject(patients, {
                  detectedstate: filters.detectedstate,
                  detecteddistrict: filters.detecteddistrict,
                }),
                'detectedcity'
              ).map((city, index) => {
                return (
                  <option key={index} value={city}>
                    {city}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="select">
            <select
              style={{animationDelay: '0.4s'}}
              onChange={(event) => {
                handleFilters('dateannounced', event.target.value);
              }}
            >
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
        </div>

        <div className="legend">
          {colorMode === 'genders' && (
            <div className="legend-left">
              <div className="circle is-female"></div>
              <h5 className="is-female">Female</h5>
              <div className="circle is-male"></div>
              <h5 className="is-male">Male</h5>
              <div className="circle"></div>
              <h5 className="">Unknown</h5>
            </div>
          )}

          {colorMode === 'transmission' && (
            <div className="legend-left">
              <div className="circle is-local"></div>
              <h5 className="is-local">Local</h5>
              <div className="circle is-imported"></div>
              <h5 className="is-imported">Imported</h5>
              <div className="circle"></div>
              <h5 className="">TBD</h5>
            </div>
          )}

          {colorMode === 'nationality' && (
            <div className="legend-left nationality">
              <div className="circle is-in"></div>
              <h5 className="is-in">In</h5>
              <div className="circle is-uk"></div>
              <h5 className="is-uk">Uk</h5>
              <div className="circle is-us"></div>
              <h5 className="is-us">Us</h5>
              <div className="circle is-th"></div>
              <h5 className="is-thailand">Th</h5>
              <div className="circle is-ph"></div>
              <h5 className="is-ph">Ph</h5>
              <div className="circle is-it"></div>
              <h5 className="is-it">It</h5>
              <div className="circle is-ca"></div>
              <h5 className="is-ca">Ca</h5>
              <div className="circle is-id"></div>
              <h5 className="is-id">Id</h5>
              <div className="circle is-mm"></div>
              <h5 className="is-mm">Mm</h5>
            </div>
          )}

          <div className="select">
            <select
              style={{animationDelay: '0.4s'}}
              onChange={(event) => {
                setColorMode(event.target.value);
              }}
            >
              <option value="genders">Genders</option>
              <option value="transmission">Transmission</option>
              <option value="nationality">Nationality</option>
            </select>
          </div>
        </div>
      </div>

      <div className="header fadeInUp" style={{animationDelay: '0.3s'}}>
        <h1>Patients Database</h1>
        <h3>No. of Patients: {patients.length}</h3>
      </div>

      <div className="patientdb-wrapper">
        <Patients patients={filteredPatients} colorMode={colorMode} />
      </div>
      <DownloadBlock patients={patients} />
    </div>
  );
}

export default PatientDB;
