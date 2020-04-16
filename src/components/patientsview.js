import React from 'react';
import {format} from 'date-fns';

function PatientsView(props) {
  const logs = props.logs;

  return (
    <div className="Patients fadeInUp" style={{animationDelay: '1s'}}>
      {Object.keys(logs)
        .slice(props.summary ? -1 : 0)
        .map((day, index) => {
          if (day !== 'Invalid Date') {
            return (
              <React.Fragment key={index}>
                <h5 className="daylabel">
                  {format(new Date(day), 'dd MMM, yyyy')}{' '}
                  {'(' + logs[day].length + ')'}
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
                          className={props.applyClass(patient)}
                          onClick={() => {
                            props.setModal(true);
                            props.setPatient(patient);
                          }}
                        >
                          <h3>
                            {props.expand ? `P${patient.patientnumber}` : ''}
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
  );
}

export default PatientsView;
