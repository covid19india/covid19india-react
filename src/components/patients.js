import React, {useState, useEffect, useCallback} from 'react';
import {parse, format} from 'date-fns';
import * as Icon from 'react-feather';

function Patients(props) {
  const [patients, setPatients] = useState(props.patients);
  const [logs, setLogs] = useState({});
  const [index, setIndex] = useState(0);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    setPatients(props.patients);
  }, [props.patients]);

  const parseByDate = useCallback((patients) => {
    const log = {};
    for (let i = 0; i < patients.length; i++) {
      const day = new Date(
        parse(patients[i].dateannounced, 'dd/MM/yyyy', new Date())
      );
      if (!(day in log)) {
        const list = [];
        list.push({
          index: i,
        });
        log[day] = list;
      } else {
        const list = log[day];
        list.push({
          index: i,
        });
        log[day] = list;
      }
    }
    setLogs(log);
  }, []);

  useEffect(() => {
    if (patients.length > 1) {
      parseByDate(patients);
    }
  }, [parseByDate, patients]);

  const switchPatient = (patientIndexArg) => {
    try {
      const patientIndex = patientIndexArg.slice(1);
      setIndex(patientIndex);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <div className="Patients fadeInUp" style={{animationDelay: '1s'}}>
        {Object.keys(logs).map((day, index) => {
          if (day !== 'Invalid Date') {
            return (
              <React.Fragment>
                <h5 className="daylabel">
                  {format(new Date(day), 'dd MMM, yyyy')}
                </h5>
                <div key={index} className="day">
                  {logs[day].map((patient, indexTwo) => {
                    return (
                      <div
                        key={indexTwo}
                        className="patient-card"
                        onClick={() => {
                          setModal(true);
                          setIndex(patient.index);
                        }}
                      >
                        <h3>{patients[patient.index].patientnumber}</h3>
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

      {modal && (
        <div className="modal">
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
              <h1>#{patients[index].patientnumber}</h1>
            </div>

            <div className="meta">
              <h5>Date Announced</h5>
              <h3>
                {patients[index].dateannounced
                  ? patients[index].dateannounced
                  : '?'}
              </h3>

              <h5>Contracted from</h5>
              <h3
                className="contracted-from"
                onClick={() => {
                  switchPatient(
                    patients[index].contractedfromwhichpatientsuspected
                  );
                }}
              >
                {patients[index].contractedfromwhichpatientsuspected
                  ? patients[index].contractedfromwhichpatientsuspected
                  : '?'}
              </h3>

              <h5>Detected City</h5>
              <h3>
                {patients[index].detectedcity
                  ? patients[index].detectedcity
                  : '?'}
              </h3>

              <h5>Detected District</h5>
              <h3>
                {patients[index].detecteddistrict
                  ? patients[index].detecteddistrict
                  : '?'}
              </h3>

              <h5>Detected State</h5>
              <h3>
                {patients[index].detectedstate
                  ? patients[index].detectedstate
                  : '?'}
              </h3>

              <h5>Nationality</h5>
              <h3>
                {patients[index].nationality
                  ? patients[index].nationality
                  : '?'}
              </h3>

              <h5>Age</h5>
              <h3>
                {patients[index].agebracket ? patients[index].agebracket : '?'}
              </h3>

              <h5>Gender</h5>
              <h3>{patients[index].gender ? patients[index].gender : '?'}</h3>

              <h5>State Patient Number</h5>
              <h3>
                {patients[index].statepatientnumber
                  ? patients[index].statepatientnumber
                  : '?'}
              </h3>

              <h5>Type of transmission</h5>
              <h3>
                {patients[index].typeoftransmission
                  ? patients[index].typeoftransmission
                  : '?'}
              </h3>
            </div>

            <div className="notes">
              <h5>Notes</h5>
              <h3>{patients[index].notes}</h3>
            </div>

            <h5>Source 1</h5>
            <div className="link">
              <a href={patients[index].source1} target="_noblank">
                {patients[index].source1}
              </a>
            </div>

            <h5>Source 2</h5>
            <div className="link">
              <a href={patients[index].source1} target="_noblank">
                {patients[index].source2}
              </a>
            </div>

            <h5>Source 3</h5>
            <div className="link">
              <a href={patients[index].source1} target="_noblank">
                {patients[index].source3}
              </a>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Patients;
