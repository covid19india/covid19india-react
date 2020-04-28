import MapChart from './statelist';

import React, {useState} from 'react';
import {MapPin} from 'react-feather';

const Tracker = (props) => {
  const [currentLocation, setCurrentLocation] = useState(null);

  const getLocationHandler = (event) => {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
    });
  };

  return (
    <div className="tracker">
      {currentLocation ? (
        <div className="Search">
          <MapChart userLocation={currentLocation} />
        </div>
      ) : (
        <div className="tabs">
          <button
            className="tab"
            onClick={(event) => getLocationHandler(event)}
          >
            <MapPin /> &nbsp;
            <h1>Essentials Nearby</h1>
          </button>
        </div>
      )}
    </div>
  );
};
export default Tracker;
