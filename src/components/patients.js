import React, {useState, useEffect, useCallback} from 'react';
import {parse, format} from 'date-fns';
import * as Icon from 'react-feather';
import * as d3 from 'd3';

function Patients(props) {
  const [patients, setPatients] = useState(props.patients);
  const [patient, setPatient] = useState(props.patients.slice(-1));
  const [logs, setLogs] = useState({});
  const [modal, setModal] = useState(false);

  // When the user clicks anywhere outside of the modal, close modal
  window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
      setModal(false);
    }
  };

  useEffect(() => {
    setPatients(props.patients);
  }, [props.patients]);

  useEffect(() => {
    if (modal) document.body.classList.add('modal-open');
    else document.body.classList.remove('modal-open'); // to remove modal-open class from body
  }, [modal]);

  const parseByDate = useCallback((patients) => {
    const log = {};
    for (let i = 0; i < patients.length; i++) {
      const day = new Date(
        parse(patients[i].dateannounced, 'dd/MM/yyyy', new Date())
      );
      if (!(day in log)) {
        const list = [];
        list.push(patients[i]);
        log[day] = list;
      } else {
        const list = log[day];
        list.push(patients[i]);
        log[day] = list;
      }
    }
    setLogs(log);
  }, []);

  useEffect(() => {
    if (patients.length) {
      parseByDate(patients);
    }
  }, [parseByDate, patients]);

  const switchPatient = (patientIndexArg) => {
    if (patientIndexArg === '') return;
    try {
      const patientIndex = patientIndexArg.slice(1);
      // eslint-disable-next-line
      patients.map((patient, index) => {
        if (patient.patientnumber === patientIndex) setPatient(patient);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      {props.colorMode === 'genders' && (
        <div className="Patients fadeInUp" style={{animationDelay: '1s'}}>
          {Object.keys(logs)
            .slice(props.summary ? -1 : 0)
            .map((day, index) => {
              if (day !== 'Invalid Date') {
                return (
                  <React.Fragment key={index}>
                    <h5 className="daylabel">
                      {format(new Date(day), 'dd MMM, yyyy')}
                    </h5>
                    <div
                      key={index}
                      className={`day ${props.summary ? 'summary' : ''}`}
                    >
                      {logs[day]
                        .slice(props.summary ? -40 : 0)
                        .map((patient, indexTwo) => {
                          return (
                            <div
                              key={indexTwo}
                              className={`patient-card ${
                                patient.gender === 'F'
                                  ? 'is-femme'
                                  : patient.gender === 'M'
                                  ? 'is-male'
                                  : ''
                              } ${props.expand ? '' : 'is-small'}`}
                              onClick={() => {
                                setModal(true);
                                setPatient(patient);
                              }}
                            >
                              <h3>
                                {props.expand
                                  ? `P${patient.patientnumber}`
                                  : ''}
                              </h3>
                            </div>
                          );
                        })}
                    </div>
                  </React.Fragment>
                );
              } else {
                return null;
              }
            })}
        </div>
      )}

      {props.colorMode === 'transmission' && (
        <div className="Patients fadeInUp" style={{animationDelay: '1s'}}>
          {Object.keys(logs)
            .slice(props.summary ? -1 : 0)
            .map((day, index) => {
              if (day !== 'Invalid Date') {
                return (
                  <React.Fragment>
                    <h5 className="daylabel">
                      {format(new Date(day), 'dd MMM, yyyy')}
                    </h5>
                    <div
                      key={index}
                      className={`day ${props.summary ? 'summary' : ''}`}
                    >
                      {logs[day]
                        .slice(props.summary ? -40 : 0)
                        .map((patient, indexTwo) => {
                          return (
                            <div
                              key={indexTwo}
                              className={`patient-card ${
                                patient.typeoftransmission === 'Local'
                                  ? 'is-local'
                                  : patient.typeoftransmission === 'Imported'
                                  ? 'is-imported'
                                  : ''
                              } ${props.expand ? '' : 'is-small'}`}
                              onClick={() => {
                                setModal(true);
                                setPatient(patient);
                              }}
                            >
                              <h3>
                                {props.expand
                                  ? `P${patient.patientnumber}`
                                  : ''}
                              </h3>
                            </div>
                          );
                        })}
                    </div>
                  </React.Fragment>
                );
              } else {
                return null;
              }
            })}
        </div>
      )}

      {props.colorMode === 'nationality' && (
        <div className="Patients fadeInUp" style={{animationDelay: '1s'}}>
          {Object.keys(logs)
            .slice(props.summary ? -1 : 0)
            .map((day, index) => {
              if (day !== 'Invalid Date') {
                return (
                  <React.Fragment>
                    <h5 className="daylabel">
                      {format(new Date(day), 'dd MMM, yyyy')}
                    </h5>
                    <div
                      key={index}
                      className={`day ${props.summary ? 'summary' : ''}`}
                    >
                      {logs[day]
                        .slice(props.summary ? -40 : 0)
                        .map((patient, indexTwo) => {
                          return (
                            <div
                              key={indexTwo}
                              className={`patient-card ${
                                patient.nationality === 'India'
                                  ? 'is-in'
                                  : patient.nationality === 'Myanmar'
                                  ? 'is-mm'
                                  : patient.nationality === 'Indonesia'
                                  ? 'is-id'
                                  : patient.nationality === 'United Kingdom'
                                  ? 'is-uk'
                                  : patient.nationality ===
                                    'United States of America'
                                  ? 'is-us'
                                  : patient.nationality === 'Thailand'
                                  ? 'is-th'
                                  : patient.nationality === 'Phillipines'
                                  ? 'is-ph'
                                  : patient.nationality === 'Italy'
                                  ? 'is-it'
                                  : patient.nationality === 'Canada'
                                  ? 'is-ca'
                                  : ''
                              } ${props.expand ? '' : 'is-small'}`}
                              onClick={() => {
                                setModal(true);
                                setPatient(patient);
                              }}
                            >
                              <h3>
                                {props.expand
                                  ? `P${patient.patientnumber}`
                                  : ''}
                              </h3>
                            </div>
                          );
                        })}
                    </div>
                  </React.Fragment>
                );
              } else {
                return null;
              }
            })}
        </div>
      )}

      {props.colorMode === 'age' && (
        <div className="Patients fadeInUp" style={{animationDelay: '1s'}}>
          {Object.keys(logs)
            .slice(props.summary ? -1 : 0)
            .map((day, index) => {
              if (day !== 'Invalid Date') {
                return (
                  <React.Fragment>
                    <h5 className="daylabel">
                      {format(new Date(day), 'dd MMM, yyyy')}
                    </h5>
                    <div
                      key={index}
                      className={`day ${props.summary ? 'summary' : ''}`}
                    >
                      {logs[day]
                        .slice(props.summary ? -40 : 0)
                        .map((patient, indexTwo) => {
                          return (
                            <div
                              key={indexTwo}
                              style={{
                                background: d3.interpolateReds(
                                  patient.agebracket / 100
                                ),
                              }}
                              className={`patient-card ${
                                props.expand ? '' : 'is-small'
                              }`}
                              onClick={() => {
                                setModal(true);
                                setPatient(patient);
                              }}
                            >
                              <h3
                                style={{
                                  color: d3.interpolateReds(
                                    1 - patient.agebracket / 100
                                  ),
                                }}
                              >
                                {props.expand ? `${patient.agebracket}` : ''}
                              </h3>
                            </div>
                          );
                        })}
                    </div>
                  </React.Fragment>
                );
              } else {
                return null;
              }
            })}
        </div>
      )}

      {modal && (
        <div className="modal" id="modal">
          <div
            className={`modal-content ${modal ? 'fadeInUp' : 'fadeOutDown'}`}
          >
            <div className="close-button">
              <Icon.XCircle
                onClick={() => {
                  setModal(false);
                }}
              />
            </div>

            <div className="modal-top">
              <h1>#{patient.patientnumber}</h1>
            </div>

            <div className="meta">
              <h5>Date Announced</h5>
              <h3>{patient.dateannounced ? patient.dateannounced : '?'}</h3>

              <h5>Contracted from</h5>
              <h3
                className="contracted-from"
                onClick={() => {
                  switchPatient(patient.contractedfromwhichpatientsuspected);
                }}
              >
                {patient.contractedfromwhichpatientsuspected
                  ? patient.contractedfromwhichpatientsuspected
                  : '?'}
              </h3>

              <h5>Detected City</h5>
              <h3>{patient.detectedcity ? patient.detectedcity : '?'}</h3>

              <h5>Detected District</h5>
              <h3>
                {patient.detecteddistrict ? patient.detecteddistrict : '?'}
              </h3>

              <h5>Detected State</h5>
              <h3>{patient.detectedstate ? patient.detectedstate : '?'}</h3>

              <h5>Nationality</h5>
              <h3>{patient.nationality ? patient.nationality : '?'}</h3>

              <h5>Age</h5>
              <h3>{patient.agebracket ? patient.agebracket : '?'}</h3>

              <h5>Gender</h5>
              <h3>{patient.gender ? patient.gender : '?'}</h3>

              <h5>State Patient Number</h5>
              <h3>
                {patient.statepatientnumber ? patient.statepatientnumber : '?'}
              </h3>

              <h5>Type of transmission</h5>
              <h3>
                {patient.typeoftransmission ? patient.typeoftransmission : '?'}
              </h3>
            </div>

            <div className="notes">
              <h5>Notes</h5>
              <h3>{patient.notes}</h3>
            </div>

            <h5>Source 1</h5>
            <div className="link">
              <a href={patient.source1} target="_noblank">
                {patient.source1}
              </a>
            </div>

            <h5>Source 2</h5>
            <div className="link">
              <a href={patient.source1} target="_noblank">
                {patient.source2}
              </a>
            </div>

            <h5>Source 3</h5>
            <div className="link">
              <a href={patient.source1} target="_noblank">
                {patient.source3}
              </a>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Patients;
