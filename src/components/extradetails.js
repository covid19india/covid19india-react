import React from 'react';

function ExtraDetails({ patient }) {
  console.log(patient);
  return (
    <div className="pl-5">
      {patient.statepatientnumber ? <p><strong>State Patient Number: </strong> {patient.statepatientnumber}</p> : ''}
      {patient.statuschangedate ? <p><strong>Status Changed Date: </strong> {patient.statuschangedate}</p> : ''}
      {patient.notes ? <p><strong>Notes: </strong> <span className="text-normal">{patient.notes}</span></p> : '' }
      {
        patient.contractedfromwhichpatientsuspected ?
        <p><strong>Suspected Infecton from: </strong> Patient {patient.contractedfromwhichpatientsuspected}</p> :
        ''
      }
      {patient.source1 ? <p><strong>Source 1: </strong> <a href={patient.source1} className="text-normal">{patient.source1}</a></p>: ''}
      {patient.source2 ? <p><strong>Source 2: </strong> <a href={patient.source2} className="text-normal">{patient.source2}</a></p>: ''}
      {patient.source3 ? <p><strong>Source 3: </strong> <a href={patient.source3} className="text-normal">{patient.source3}</a></p>: ''}
    </div>
  );
}

export default ExtraDetails;