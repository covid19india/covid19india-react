import React, {useState, useEffect} from 'react';
import * as Icon from 'react-feather';

function Patients(props) {
  const [patients, setPatients] = useState(props.patients);
  const [index, setIndex] = useState(0);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    setPatients(props.patients);
  }, [props.patients]);

  return (
    <React.Fragment>
      <div className="Patients fadeInUp" style={{animationDelay: '1s'}}>
        {patients.map((patient, index) => {
          return (
            <div
              key={index}
              className={`patient-card ${index < 20 ? 'fadeInUp' : ''}`}
              style={{animationDelay: `${index < 20 ? index * 0.05 : 0}s`}}
              onClick={() => {
                setModal(true);
                setIndex(index);
              }}
            >
              <div className="patient-card-left">
                <div className="patient-card-left-top">
                  <h2>#{patient.patientnumber}</h2>
                  <h6>Announced</h6>
                  <h3>{patient.dateannounced}</h3>
                </div>
                <div className="patient-card-left-bottom">
                  <div className="patient-card-snippet">
                    <h6>Gender</h6>
                    <h4>{patient.gender ? patient.gender : '?'}</h4>
                  </div>
                  <div className="patient-card-snippet">
                    <h6>Age</h6>
                    <h4>{patient.agebracket ? patient.agebracket : '?'}</h4>
                  </div>
                </div>
              </div>

              <div className="patient-card-right">
                <div className="patient-card-right-top">
                  <h6>City</h6>
                  <h5>{patient.detectedcity}</h5>
                  <h6>District</h6>
                  <h5>{patient.detecteddistrict}</h5>
                  <h6>State</h6>
                  <h5>{patient.detectedstate}</h5>
                </div>
              </div>
            </div>
          );
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
              <h3>
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
