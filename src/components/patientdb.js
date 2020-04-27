import DownloadBlock from './downloadblock';
import Footer from './footer';
import Patients from './patients';

import axios from 'axios';
import {format, subDays} from 'date-fns';
import React, {useState, useEffect} from 'react';
import DatePicker from 'react-date-picker';
import * as Icon from 'react-feather';
import {useLocation} from 'react-router-dom';
import {useEffectOnce, useLocalStorage} from 'react-use';

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
  const {pathname} = useLocation();
  const [colorMode, setColorMode] = useState('genders');
  const [scaleMode, setScaleMode] = useState(false);
  const [filterDate, setFilterDate] = useState(subDays(new Date(), 1));
  const [showReminder, setShowReminder] = useLocalStorage('showReminder', true);
  const [message, setMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    detectedstate: '',
    detecteddistrict: '',
    detectedcity: '',
    dateannounced: format(subDays(new Date(), 1), 'dd/MM/yyyy'),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffectOnce(() => {
    try {
      axios
        .get('https://api.covid19india.org/raw_data.json')
        .then((response) => {
          setPatients(response.data.raw_data.reverse());
          setFetched(true);
        });
    } catch (err) {
      console.log(err);
    }
  });

  useEffect(() => {
    const datePickers = document.querySelectorAll(
      '.react-date-picker__inputGroup input'
    );
    datePickers.forEach((el) => el.setAttribute('readOnly', true));
  }, []);

  const handleFilters = (label, value) => {
    setFilters((f) => {
      // Create new object (deep copy)
      const newFilters = {...f};
      newFilters[label] = value;
      if (label === 'detectedstate') {
        const district = document.getElementById('district');
        const city = document.getElementById('city');
        // Hide boxes
        if (value === '') district.style.display = 'none';
        else district.style.display = 'inline';
        city.style.display = 'none';
        // Default to empty selection
        district.selectedIndex = 0;
        city.selectedIndex = 0;
        newFilters['detecteddistrict'] = '';
        newFilters['detectedcity'] = '';
      } else if (label === 'detecteddistrict') {
        const city = document.getElementById('city');
        // Hide box
        if (value === '') city.style.display = 'none';
        else city.style.display = 'inline';
        // Default to empty selection
        city.selectedIndex = 0;
        newFilters['detectedcity'] = '';
      }
      return newFilters;
    });
  };

  useEffect(() => {
    if (filterByObject(patients, filters).length > 0) {
      setFilteredPatients(filterByObject(patients, filters));
      setMessage(false);
      setLoading(false);
    } else {
      setMessage(true);
    }
  }, [patients, filters]);

  function getSortedValues(obj, key) {
    const setValues = new Set(obj.map((p) => p[key]));
    if (setValues.size > 1) setValues.add('');
    if (key === 'dateannounced') return Array.from(setValues);
    return Array.from(setValues).sort();
  }

  return (
    <div className="PatientsDB">
      <div className="filters fadeInUp" style={{animationDelay: '0.2s'}}>
        <div className="filters-left">
          <div className="select">
            <select
              style={{animationDelay: '0.3s'}}
              id="state"
              onChange={(event) => {
                handleFilters('detectedstate', event.target.value);
              }}
              defaultValue={filters.detectedstate}
            >
              <option value="" disabled>
                Select State
              </option>
              {getSortedValues(patients, 'detectedstate').map(
                (state, index) => {
                  return (
                    <option key={index} value={state}>
                      {state === '' ? 'All' : state}
                    </option>
                  );
                }
              )}
            </select>
          </div>

          <div className="select">
            <select
              style={{animationDelay: '0.4s', display: 'none'}}
              id="district"
              onChange={(event) => {
                handleFilters('detecteddistrict', event.target.value);
              }}
              defaultValue={filters.detecteddistrict}
            >
              <option value="" disabled>
                Select District
              </option>
              {getSortedValues(
                filterByObject(patients, {
                  detectedstate: filters.detectedstate,
                }),
                'detecteddistrict'
              ).map((district, index) => {
                return (
                  <option key={index} value={district}>
                    {district === '' ? 'All' : district}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="select">
            <select
              style={{animationDelay: '0.4s', display: 'none'}}
              id="city"
              onChange={(event) => {
                handleFilters('detectedcity', event.target.value);
              }}
              defaultValue={filters.detectedcity}
            >
              <option value="" disabled>
                Select City
              </option>
              {getSortedValues(
                filterByObject(patients, {
                  detectedstate: filters.detectedstate,
                  detecteddistrict: filters.detecteddistrict,
                }),
                'detectedcity'
              ).map((city, index) => {
                return (
                  <option key={index} value={city}>
                    {city === '' ? 'All' : city}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="select">
            <select
              style={{animationDelay: '0.4s', display: 'none'}}
              id="city"
              onChange={(event) => {
                handleFilters('detectedcity', event.target.value);
              }}
              defaultValue={filters.detectedcity}
            >
              <option value="" disabled>
                Select City
              </option>
              {getSortedValues(
                filterByObject(patients, {
                  detectedstate: filters.detectedstate,
                  detecteddistrict: filters.detecteddistrict,
                }),
                'detectedcity'
              ).map((city, index) => {
                return (
                  <option key={index} value={city}>
                    {city === '' ? 'All' : city}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="select">
            <DatePicker
              value={filterDate}
              minDate={new Date('30-Jan-2020')}
              maxDate={subDays(new Date(), 1)}
              format="dd/MM/y"
              calendarIcon={<Icon.Calendar />}
              inputProps={
                (onkeydown = (e) => {
                  e.preventDefault();
                })
              }
              clearIcon={<Icon.XCircle />}
              onChange={(date) => {
                setFilterDate(date);
                const fomattedDate = !!date ? format(date, 'dd/MM/yyyy') : '';
                handleFilters('dateannounced', fomattedDate);
              }}
            />
          </div>

          {/* <div className="select">
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
          </div>*/}
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
              <h5 className="">Unknown</h5>
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

          <div className={`select ${colorMode}`}>
            <select
              style={{animationDelay: '0.4s'}}
              onChange={(event) => {
                setColorMode(event.target.value);
              }}
              defaultValue={colorMode}
            >
              {/* <option value="" disabled>
                Color modes
              </option> */}
              <option value="genders">Genders</option>
              <option value="transmission">Transmission</option>
              <option value="nationality">Nationality</option>
              {/* <option value="age">Age</option>*/}
            </select>
          </div>
        </div>
      </div>

      <div className="header fadeInUp" style={{animationDelay: '0.3s'}}>
        <div>
          <h1>Demographics</h1>

          <div className="deep-dive">
            <h5>Expand</h5>
            <input
              type="checkbox"
              checked={scaleMode}
              onChange={(event) => {
                setScaleMode(!scaleMode);
              }}
              className="switch"
            />
          </div>
        </div>
        <h6 className="disclaimer">
          Some of the data provided might be missing/unknown as the details have
          not been shared by the state/central governments
        </h6>
      </div>

      <div
        className="reminder fadeInUp"
        style={{animationDelay: '1s', display: showReminder ? '' : 'none'}}
      >
        <Icon.XCircle
          onClick={() => {
            setShowReminder(false);
          }}
        />
        <p>
          It is important that we do not think of these as just tiny boxes,
          numbers, or just another part of statistics - among these are our
          neighbors, our teachers, our healthcare workers, our supermarket
          vendors, our friends, our co-workers, our children or our
          grandparents.
          <br />
          <br />
          Among these are our people.
        </p>
      </div>

      {fetched && (
        <div className="patientdb-wrapper">
          {loading ? (
            ' '
          ) : message ? (
            <div className="no-result">
              <h5>
                There were no new cases in
                <span>
                  {filters.detectedcity.length > 0
                    ? ` ${filters.detectedcity}, `
                    : ''}
                  {filters.detecteddistrict.length > 0
                    ? ` ${filters.detecteddistrict}, `
                    : ''}
                  {' ' + filters.detectedstate}
                </span>{' '}
                on <span>{filters.dateannounced}.</span>
              </h5>
            </div>
          ) : (
            <Patients
              patients={filteredPatients}
              colorMode={colorMode}
              expand={scaleMode}
            />
          )}
        </div>
      )}

      <DownloadBlock patients={patients} />
      <Footer />
    </div>
  );
}

export default PatientDB;
