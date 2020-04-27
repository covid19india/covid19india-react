import {format} from 'date-fns';
import React from 'react';

function PatientsView({
  logs,
  summary,
  setModal,
  setPatient,
  expand,
  applyClass,
}) {
  return (
    <div className="Patients fadeInUp" style={{animationDelay: '1s'}}>
      {Object.keys(logs)
        .slice(summary ? -1 : 0)
        .map((day, index) => {
          if (day !== 'Invalid Date') {
            return (
              <React.Fragment key={index}>
                <h5 className="daylabel">
                  {format(new Date(day), 'dd MMM, yyyy')}{' '}
                  {'(' + logs[day].length + ')'}
                </h5>
                <div key={index} className={`day ${summary ? 'summary' : ''}`}>
                  {logs[day]
                    .slice(summary ? -40 : 0)
                    .map((patient, indexTwo) => {
                      return (
                        <div
                          key={indexTwo}
                          className={applyClass(patient)}
                          onClick={() => {
                            setModal(true);
                            setPatient(patient);
                          }}
                        >
                          <h3>{expand ? `P${patient.patientnumber}` : ''}</h3>
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
